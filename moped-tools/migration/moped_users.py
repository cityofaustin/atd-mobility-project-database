#
# Moped Users Migration Configuration
#
from helpers import *

#
# Main Configuration
#
moped_user_process = {
    # Lave it here for now...
    "table": "moped_users",

    # SQL Query (the order of the columns affects the lambda function below)
    "sql": "SELECT * FROM `Employees`",

    # Basically, this lambda function will rename the keys
    # so that it's compatible with Hasura by creating/replacing
    # the current object with a new one.
    "transform": lambda row: {
        "first_name": split_name(row[0], 0),
        "last_name": split_name(row[0], 1),
        "title": str(row[4]),
        "workgroup": get_workgroup_name(get_org_workgroup_id(row[3])),
        "workgroup_id": get_org_workgroup_id(row[3]),
        "is_coa_staff": is_coa_staff(generate_email(row[0]).lower()),
        "email": generate_email(row[0]).lower(),
        "roles": [
            "moped-editor"
        ],
    },

    # Special rules that cannot be put here
    "cleanup": None,

    # Mutation Template
    "graphql": """
        mutation MigrateMopedUsers($object: moped_users_insert_input!) {
            insert_moped_users(
                objects: [$object],
                on_conflict: {
                    constraint: moped_users_email_key,
                    update_columns: [
                        first_name,
                        last_name,
                        title,
                        workgroup,
                        workgroup_id,
                        is_coa_staff,
                        roles,
                    ]
                }
            ) {
                affected_rows
            }
        }
    """
}