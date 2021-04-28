#
# Moped Project Phases Mapping configuration
#

from helpers import *
from .moped_project_phases_mappings import *


#
# Main Configuration
#
moped_project_phases_process = {
    # Lave it here for now...
    "table": "moped_proj_personnel",

    # SQL Query (the order of the columns affects the lambda function below)
    "sql": "SELECT `ProjectID`, LOWER(`ProjectPhase`) FROM `Projects`",

    # Basically, this lambda function will rename the keys
    # so that it's compatible with Hasura by creating/replacing
    # the current object with a new one.
    "transform": lambda row: {
        "project_id": row[0],
        "project_phase_id": get_phase_id(row[1]),
        "phase_name": get_moped_phase_name(row[1]),
        "completion_percentage": 100,
        "completed": True
    },

    "prefilter": None,

    # Special rules that cannot be put here
    "cleanup": None,

    # Mutation Template
    "graphql": """
        mutation MigrateMopedProjectPhases($object: moped_proj_phases_insert_input!) {
            insert_moped_proj_phases(
                objects: [$object],
                on_conflict: {
                    constraint: moped_phase_history_pkey,
                    update_columns: [
                        project_id
                        phase_name
                        project_phase_id
                    ]
                }
            ) {
                affected_rows
            }
        }
    """
}
