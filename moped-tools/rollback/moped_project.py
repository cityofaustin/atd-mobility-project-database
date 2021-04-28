#
# Main Configuration
#
moped_project_process = {
    # Lave it here for now...
    "table": "projects",

    # SQL Query (the order of the columns affects the lambda function below)
    "sql": "SELECT ProjectID FROM PROJECTS",

    # Basically, this lambda function will rename the keys
    # so that it's compatible with Hasura by creating/replacing
    # the current object with a new one.
    "transform": lambda row: row[0],

    # Special rules that cannot be put here
    "cleanup": None,

    # Mutation Template
    "graphql": """
        mutation deleteMopedProjects($projectIds: [Int!]!) {
            delete_moped_proj_milestones(where:{project_id:{_in:$projectIds}}){affected_rows}
            delete_moped_proj_phases(where:{project_id:{_in:$projectIds}}){affected_rows}
            delete_moped_proj_personnel(where:{project_id:{_in:$projectIds}}){affected_rows}
            delete_moped_proj_status_history(where:{project_id:{_in:$projectIds}}){affected_rows}
            delete_moped_proj_timeline(where:{project_id:{_in:$projectIds}}){affected_rows}
            delete_moped_project(where:{project_id:{_in:$projectIds}}){affected_rows}
        }
    """
}
