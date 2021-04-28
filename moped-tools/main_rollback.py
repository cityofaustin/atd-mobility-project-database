import json
import jaydebeapi

from graphql import run_query

# Import cleanup functions
from rollback.moped_project import moped_project_process

# Maybe change this to be dynamic by accepting a command line parameter?
db_path = "/app/database.mdb"

# JDBC Database Drivers
ucanaccess_jars = [
    "/app/jdbc/ucanaccess-5.0.1.jar",
    "/app/jdbc/lib/commons-lang3-3.8.1.jar",
    "/app/jdbc/lib/commons-logging-1.2.jar",
    "/app/jdbc/lib/hsqldb-2.5.0.jar",
    "/app/jdbc/lib/jackcess-3.0.1.jar",
]

# Class path
classpath = ":".join(ucanaccess_jars)

print("Connecting to the database...")
# Establish connection object using drivers
db_connection = jaydebeapi.connect(
    "net.ucanaccess.jdbc.UcanaccessDriver",
    f"jdbc:ucanaccess://{db_path};newDatabaseVersion=V2010",
    ["", ""],
    classpath,
)

print("Database connection established")

# Every step is followed in order. This configuration
# can get very long, maybe it's best to use python
# comprehensions to distribute these settings.
process_list = [
    # 1. Delete Projects
    moped_project_process,
]


# Processes a single record
def process_record(record: dict, graphql: str, cleanup: callable):
    if cleanup is not None:
        record = cleanup(record)

    response = run_query(variables=record, query=graphql)

    print(f"Record: {json.dumps(record)}")
    print(f"Query: {graphql}")
    print(f"Response: {json.dumps(response)}")


#
# For every table configuration in process_list...
#
for process in process_list:
    db_rows = []

    print(f"Working on: {process['table']}")

    # Establish new cursor
    print("Establishing new database cursor")
    db_cursor = db_connection.cursor()

    # Execute SQL on cursor
    print("Executing SQL query against Access")
    db_cursor.execute(process["sql"])

    # Iterate through the cursor
    print("Fetching data to array")
    for row in db_cursor.fetchall():
        db_rows.append(row)

    # Pre-Filter (i.e., remove empty records)
    if "prefilter" in process:
        print("Running filter")
        db_rows = list(filter(process["prefilter"], db_rows))

    # Transform (or Map) every individual record from type tuple into dictionary
    data_records = list(map(process["transform"], db_rows))

    process_record(
        record={"projectIds": data_records},
        graphql=process["graphql"],
        cleanup=process["cleanup"]
    )

    print("--------------------------------")

    if "postcleanup" in process:
        print("Running post-process cleanup")
        process["postcleanup"]()

    print("Closing database cursor")
    db_cursor.close()

print("Closing database connection")
db_connection.close()

print("Done")
