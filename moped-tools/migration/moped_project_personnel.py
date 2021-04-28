#
# Moped Project Personnel Mapping Configuration
#

from helpers import *
from graphql import run_query

ACCESS_ROLES_TO_MOPED_ROLES = {
    "atd project sponsor": 11,
    "design support": 6,
    "designer": 7,
    "field engineer": 10,
    "implementation support": 9,
    "lead designer - pe": 7,
    "program manager": 0,
    "project coordinator": 5,
    "project manager": 1,
    "project sponsor": 11,
    "project support": 8,
    "public engagement": 8,
}

USER_CACHE = {}

def clear_cache():
    USER_CACHE.clear()

def get_user_id(user_full_name: str) -> int:
    """
    Retrieves via GraphQL the user_id from Moped's user table
    :param str user_full_name: The first and last name of the user
    :return int: The moped user_id
    """
    user_email = generate_email(user_full_name).lower()

    if user_email in USER_CACHE:
        return USER_CACHE[user_email]

    query = """
        query GetMopedUserId($email:citext!) {
          moped_users(where: {email: {_eq: $email}}) {
            user_id
          }
        }
    """

    response = run_query(
        query=query,
        variables={
            "email": user_email
        }
    )

    if "data" in response and len(response["data"]["moped_users"]) > 0:
        try:
            user_id = response["data"]["moped_users"][0]["user_id"]
            USER_CACHE[user_email] = user_id
            return user_id
        except (KeyError,IndexError,TypeError) as e:
            print(f"Failed to retrieve user '{user_full_name}': " + str(e))

    raise KeyError(f"Cannot find user_id for '{user_full_name}' : {user_email}")


def get_project_role_id(proj_role: str) -> int:
    """
    Turns the access database name for a project role and turns it
    into a valid moped project role id number.
    :param str proj_role: The full name of the role
    :return int: The moped project role id number
    """
    proj_role = str(proj_role).lower()
    moped_role_id = ACCESS_ROLES_TO_MOPED_ROLES.get(
        # Try to find the key, and return it's value
        proj_role,
        # Or return id for "Other-Unknown"
        12
    )
    print(f"Access role {proj_role} = moped_role_id {moped_role_id}")
    return moped_role_id


#
# Main Configuration
#
moped_project_personnel_process = {
    # Lave it here for now...
    "table": "moped_proj_personnel",

    # SQL Query (the order of the columns affects the lambda function below)
    "sql": "SELECT * FROM `Project_Personnel`",

    # Basically, this lambda function will rename the keys
    # so that it's compatible with Hasura by creating/replacing
    # the current object with a new one.
    "transform": lambda row: {
        "project_id": row[1],
        "status_id": 1 if str(row[4]).lower() == "active" else 0,
        "user_id": get_user_id(row[2]),
        "role_id": get_project_role_id(row[3]),
    },

    "prefilter": lambda row: False if row[2] is None else True,

    # Special rules that cannot be put here
    "cleanup": None,

    "postcleanup": clear_cache,

    # Mutation Template
    "graphql": """
        mutation MigrateMopedProjectPersonnel($object: moped_proj_personnel_insert_input!) {
            insert_moped_proj_personnel(
                objects: [$object],
                on_conflict: {
                    constraint: moped_proj_personnel_project_id_user_id_role_id_key,
                    update_columns: [
                        project_id
                        user_id
                        role_id
                        status_id
                    ]
                }
            ) {
                affected_rows
            }
        }
    """
}
