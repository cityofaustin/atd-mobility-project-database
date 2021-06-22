import json, boto3
import re
import datetime
import pytz

import requests

from config import (
    HASURA_HTTP_HEADERS,
    HASURA_ENDPOINT,
    HASURA_EVENT_VALIDATION_SCHEMA,
    COGNITO_DYNAMO_TABLE_NAME,
    API_ENVIRONMENT,
)


class MopedEvent:
    """
    The Moped Event Class
    """

    HASURA_EVENT_VALIDATION_SCHEMA = None

    HASURA_EVENT_PAYLOAD = {}

    MOPED_PRIMARY_KEY_MAP = {}

    MOPED_GRAPHQL_MUTATION = """
        mutation InsertMopedActivityLog (
          $recordProjectId:Int = 0,
          $recordId:Int!,
          $recordType:String!,
          $recordData:jsonb!,
          $description:jsonb!,
          $updatedBy:uuid!,
          $operationType:String!,
          $timestamp:timestamptz
        ) {
          insert_moped_activity_log(objects: {
            record_project_id: $recordProjectId,
            record_id: $recordId,
            record_type: $recordType,
            record_data: $recordData,
            description: $description,
            updated_by: $updatedBy,
            operation_type: $operationType
          }) {
            affected_rows
          }
          update_moped_project(where: {project_id: {_eq: $recordId}}, _set: {updated_at: $timestamp}) {
            affected_rows
          }
        }
    """

    def __init__(self, payload: dict, load_primary_keys: bool = True):
        """
        Constructor for Moped Event
        :param payload: The event payload as provided by Lambda/SQS
        :type payload: dict
        :param load_primary_keys: If True, it will download the primary keys from S3. Default: True
        :type load_primary_keys: bool
        """
        self.HASURA_EVENT_PAYLOAD = payload
        self.HASURA_EVENT_VALIDATION_SCHEMA = HASURA_EVENT_VALIDATION_SCHEMA
        if load_primary_keys:
            self.load_primary_keys()

    def __repr__(self) -> str:
        """
        Returns the name of the class as a representation
        :return: The name of the class
        :rtype: str
        """
        return f"MopedEvent({self.get_event_type()})"

    def __str__(self) -> str:
        """
        Returns the value of payload as a string
        :return:
        :rtype: str
        """
        return json.dumps(self.HASURA_EVENT_PAYLOAD)

    @staticmethod
    def is_valid_uuid(uuid: str) -> bool:
        """
        Returns true if the uuid string is a valid UUID format.
        :param uuid: The string to be evaluated
        :type uuid: str
        :return: True if the uuid is valid
        :rtype: str
        """
        pattern = re.compile(
            r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
        )
        return True if pattern.search(uuid) else False

    def load_payload_from_str(self, payload: str) -> None:
        """
        :param payload: The event payload
        :type payload: str
        :return:
        :rtype: None
        """
        self.HASURA_EVENT_PAYLOAD = json.loads(payload)

    def load_payload_from_file(self, file: str) -> None:
        """
        Loads a json file from file
        :param file: The path to the file
        :type file: str
        """
        with open(file) as fp:
            self.HASURA_EVENT_PAYLOAD = json.load(fp)

    def get_state(self, mode: str = "new") -> dict:
        """
        Returns the old state of the payload.
        :return: The old state of the record as an dictionary
        :rtype: dict
        """
        try:
            return self.HASURA_EVENT_PAYLOAD["event"]["data"][mode]
        except (TypeError, KeyError):
            return {}

    def payload(self) -> dict:
        """
        Returns the current state of payload
        :return: The payload dictionary
        :rtype: dict
        """
        return self.HASURA_EVENT_PAYLOAD

    def can_validate(self) -> bool:
        """
        Helps determine if we can run a validation
        :return: Returns True if it can validate, false otherwise
        :rtype: bool
        """
        return False if self.HASURA_EVENT_VALIDATION_SCHEMA is None else True

    def load_primary_keys(self):
        """
        Reads the primary key settings
        :return: A dictionary containing the primary key for every table
        :rtype: dict
        """
        s3 = boto3.Session().client('s3')
        s3_object = s3.get_object(Bucket="atd-moped-data-events", Key=f"settings/moped_primary_keys_{API_ENVIRONMENT}.json")
        self.MOPED_PRIMARY_KEY_MAP = json.loads(s3_object['Body'].read())

    @staticmethod
    def get_user_profile(user_id: str) -> dict:
        """
        Retrieves the user profile from DynamoDB
        :param user_id: The user's unique email address
        :type user_id: str
        :return: The user's profile
        :rtype: dict
        """
        dynamodb = boto3.client("dynamodb", region_name="us-east-1")
        return dynamodb.get_item(
            TableName=COGNITO_DYNAMO_TABLE_NAME,
            Key={
                "user_id": {"S": user_id.replace("azuread_", "")},
            },
        )

    def get_user_profile_uuid(self, user_id: str) -> dict:
        """
        Retrieves the user profile from DynamoDB
        :param user_id: The user's cognito uuid
        :type user_id: str
        :return: The user's profile
        :rtype: dict
        """
        if not self.is_valid_uuid(user_id):
            raise TypeError("Invalid user id")

        dynamodb = boto3.client("dynamodb", region_name="us-east-1")
        return dynamodb.query(
            # Add the name of the index you want to use in your query.
            TableName=COGNITO_DYNAMO_TABLE_NAME,
            IndexName="cognito_uuid_idx",
            ExpressionAttributeValues={
                ":cid": {
                    "S": user_id,
                },
            },
            KeyConditionExpression='cognito_uuid = :cid',
        )

    def get_user_database_id(self, user_id: str, default: int = 0) -> int:
        """
        Returns the user's database id if provided in DynamoDB
        :param user_id: Either the email address or the cognito uuid
        :type user_id: str
        :param default:
        :type default:
        :return:
        :rtype:
        """

        try:
            profile = (self.get_user_profile if "@" in user_id else self.get_user_profile_uuid)(user_id=str(user_id))
            return int(profile["Item"]["database_id"]["N"] if "Item" in profile else profile["Items"][0]["database_id"]["N"])
        except (TypeError, KeyError, IndexError):
            return default

    def get_primary_key(self, table: str, default: str = None) -> str:
        """
        Returns the name of a primary key column for a table
        :param table: The table name
        :type table: str
        :param default: The default value in case it can't find it
        :type default: None
        :return: The name of the primary key field
        :rtype: str
        """
        return self.MOPED_PRIMARY_KEY_MAP.get(table, default)

    def get_event_session_var(self, variable: str, default: str = None) -> str:
        """
        Retrieves the event's session variable value by it's name
        :param variable: The session's variable name
        :type variable: str
        :param default: If the value is not found, default: None
        :type default: str
        :return: The event's Cognito UUID or Azure ID signature
        :rtype: str
        """
        try:
            return self.HASURA_EVENT_PAYLOAD["event"]["session_variables"][variable]
        except (TypeError, KeyError):
            return default

    def get_event_type(self) -> str:
        """
        Safely retrieves the event type from the event payload
        :return: The name of the table being modified
        :rtype: str
        """
        try:
            return self.HASURA_EVENT_PAYLOAD["table"]["name"]
        except (TypeError, KeyError):
            return ""

    def get_diff(self) -> dict:
        """
        Generates a dictionary with a list of all different values in the payload old and new state
        :return: The dictionary containing the diff
        :rtype: dict
        """
        change_list = []
        old_state = self.get_state("old")
        new_state = self.get_state("new")

        if old_state is None:
            return change_list
        else:
            # Gather a list of keys that present a difference in values
            keys_with_diff = list(
                filter(
                    lambda k: new_state[k] != old_state[k],  # Compare between old and new state
                    new_state.keys()  # For every key in new_state
                )
            )

        for key in keys_with_diff:
            change_list.append({
                "field": key,
                "old": old_state[key] if old_state is not None else "",
                "new": new_state[key]
            })

        return change_list

    def get_project_id(self) -> int:
        """
        Retrieves the project_id if present in the record
        :return: The project_id value of the record as an integer (from the new state).
        :rtype: int
        """
        return self.get_state("new").get("project_id", 0)

    def get_operation_type(self, default: str = None) -> str:
        """
        Returns the operation type from the hasura payload
        :return str:
        """
        try:
            return self.HASURA_EVENT_PAYLOAD["event"]["op"]
        except (TypeError, KeyError):
            return default

    def get_variables(self) -> dict:
        """
        Builds the variables needed for a Hasura HTTP request
        :return: The dictionary containing all the variables needed
        :rtype: dict
        """
        primary_key = self.get_primary_key(table=self.get_event_type())
        return {
            "recordProjectId": self.get_project_id(),
            "recordId": self.get_state("new")[primary_key],
            "recordType": self.get_event_type(),
            "recordData": self.payload(),
            "description": self.get_diff(),
            "updatedBy": self.get_event_session_var(variable="x-hasura-user-id", default=None),
            "operationType": self.get_operation_type(default=None),
            "timestamp": datetime.datetime.now(tz=pytz.utc).isoformat(),
        }

    def request(self, variables: dict, headers: dict = {}) -> dict:
        """
        Makes the GraphQL query via HTTP
        :param variables: GraphQL variables and values in kay-pair dictionary form
        :type variables: dict
        :param headers: Any additional HTTP Headers
        :type headers: dict
        :return: The HTTP response from Hasura
        :rtype: dict
        """
        response = requests.post(
            url=HASURA_ENDPOINT,
            headers={
                **HASURA_HTTP_HEADERS,
                **headers
            },
            data=json.dumps(
                {
                    "query": self.MOPED_GRAPHQL_MUTATION,
                    "variables": variables
                }
            )
        )
        response.encoding = "utf-8"
        return response.json()

    def save(self) -> dict:
        """
        Simplifies the request method
        :return: The HTTP response from Hasura
        :rtype: dict
        """
        return self.request(variables=self.get_variables())
