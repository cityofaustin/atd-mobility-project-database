
from .moped_project_phases_mappings import *


#
# Any kind of massaging before insertion to Hasura
#

def moped_project_cleanup(record):
    # If start_date is empty it will cause a GraphQL syntax error, remote it if empty then.
    if(record["start_date"] == ""):
        del record["start_date"]

    # Return record
    return record


#
# Main Configuration
#
moped_project_process = {
    # Lave it here for now...
    "table": "projects",

    # SQL Query (the order of the columns affects the lambda function below)
    "sql": "SELECT ProjectID,ProjectName,Description,ProjectPhase,ProjectInitiationDate,ECapris_ProjectID FROM PROJECTS",

    # Basically, this lambda function will rename the keys
    # so that it's compatible with Hasura by creating/replacing
    # the current object with a new one.
    "transform": lambda row: {
        "project_id": row[0],
        "project_name": row[1],
        "project_description": str(row[2]),
        "current_status": get_moped_status_name(row[3]),
        "subphase_id": get_moped_subphase_id(row[3]),
        "start_date": row[4],
        "ecapris_subproject_id": row[5],
        # We need it to be false if ecapris is empty
        "capitally_funded": False if row[5] == "" or row[5] is None else True
    },

    # Special rules that cannot be put here
    "cleanup": moped_project_cleanup,

    # Mutation Template
    "graphql": """
        mutation MigrateMopedProjects($object: moped_project_insert_input!) {
            insert_moped_project(
                objects: [$object],
                on_conflict: {
                    constraint: moped_project_pkey,
                    update_columns: [
                        project_name,
                        project_description,
                        current_status,
                        subphase_id
                        start_date,
                        ecapris_subproject_id,
                        capitally_funded,
                    ]
                }
            ) {
                affected_rows
            }
        }
    """
}
