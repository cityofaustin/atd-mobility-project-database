import os, sys
import json
import boto3
import logging
import traceback

from config import api_config
from cryptography.fernet import Fernet
from botocore.exceptions import ClientError
from typing import Optional

MOPED_API_CURRENT_ENVIRONMENT = os.getenv("MOPED_API_CURRENT_ENVIRONMENT", "STAGING")
AWS_COGNITO_DYNAMO_TABLE_NAME = os.getenv("AWS_COGNITO_DYNAMO_TABLE_NAME", None)
AWS_COGNITO_DYNAMO_SECRET_NAME = os.getenv("AWS_COGNITO_DYNAMO_SECRET_NAME", None)


def is_valid_user(current_cognito_jwt):
    user_dict = current_cognito_jwt._get_current_object()

    valid_fields = [
        "email",
        "cognito:username",
        "https://hasura.io/jwt/claims",
        "email_verified",
        "aud",
    ]

    user_email = user_dict.get("email", None)

    # Check for valid fields
    for field in valid_fields:
        if user_dict.get(field, False) == False:
            return False

    # Check for verified email
    if user_dict["email_verified"] != True:
        return False

    # Check email for austintexas.gov
    if str(user_email).endswith("@austintexas.gov") is False:
        return False

    return True


def has_user_role(role, claims):
    user_claims = claims.get("https://hasura.io/jwt/claims", {})
    allowed_roles = user_claims.get("x-hasura-allowed-roles", False)

    if allowed_roles != False:
        if role in allowed_roles:
            return True
    return False


def parse_key(aws_key_name: str, aws_key_json: str) -> Optional[str]:
    """
    Parses a json string containing a key and returns the key
    :param str aws_key_name: The name of the key to be extracted
    :param str aws_key_json: A json string to be parsed
    :return str:
    """
    return json.loads(aws_key_json)[aws_key_name]


def get_secret(secret_name: str) -> Optional[str]:
    """
    Loads the secret key from the AWS Secret Manager
    :param str secret_name: The name of the secret to retrieve
    :return Optional[str]: The secret string
    """
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)

    # In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    # See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    # We rethrow the exception by default.

    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        if e.response["Error"]["Code"] == "DecryptionFailureException":
            # Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response["Error"]["Code"] == "InternalServiceErrorException":
            # An error occurred on the server side.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response["Error"]["Code"] == "InvalidParameterException":
            # You provided an invalid value for a parameter.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response["Error"]["Code"] == "InvalidRequestException":
            # You provided a parameter value that is not valid for the current state of the resource.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response["Error"]["Code"] == "ResourceNotFoundException":
            # We can't find the resource that you asked for.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        else:
            raise e
    else:
        # Decrypts secret using the associated KMS CMK.
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if "SecretString" in get_secret_value_response:
            return parse_key(
                aws_key_name=secret_name,
                aws_key_json=get_secret_value_response["SecretString"],
            )
        else:
            # If the secret string is not read by now, then it is binary. Return None
            return None

    # This line may not be needed
    return None


def encrypt(fernet_key: str, content: str) -> Optional[str]:
    """
    Converts a dictionary into an encrypted string.
    :param str fernet_key: The key to be used to encrypt a string
    :param str content: The string to be encrypted
    :return str: The encrypted string
    """
    cipher_suite = Fernet(fernet_key)
    return cipher_suite.encrypt(content.encode()).decode()


def decrypt(fernet_key: str, content: str) -> str:
    """
    Decrypts a string using the fernet key
    :param str fernet_key: The key to be used to decrypt
    :param str content: The content to be decrypted
    :return str: The decrypted string
    """
    cipher_suite = Fernet(fernet_key)
    return cipher_suite.decrypt(content.encode()).decode()


def retrieve_claims(user_id: str) -> Optional[str]:
    """
    Retrieves the encrypted claims from DynamoDB
    :param str user_id: The user id (uuid)
    :return Optional[str]: The claims string (encrypted)
    """
    dynamodb = boto3.client("dynamodb", region_name="us-east-1")
    return dynamodb.get_item(
        TableName=AWS_COGNITO_DYNAMO_TABLE_NAME, Key={"user_id": {"S": user_id},}
    )["Item"]["claims"]["S"]


def load_claims(user_id: str) -> dict:
    """
    Loads claims from DynamoDB
    :param str user_id: The user id to retrieve the claims for
    :return dict: The claims JSON
    """
    claims = retrieve_claims(user_id=user_id)
    fernet_key = get_secret(AWS_COGNITO_DYNAMO_SECRET_NAME)
    decrypted_claims = decrypt(fernet_key=fernet_key, content=claims)
    claims = json.loads(decrypted_claims)
    claims["x-hasura-user-id"] = user_id
    return claims


def format_claims(user_id: str, roles: list) -> dict:
    """
    Formats claims to prepare for encrypting and putting in DynamoDB
    :param str user_id: The user id to retrieve the claims for
    :param list roles: The roles to set as Hasura allowed roles
    :return dict: The claims
    """
    return {
        "x-hasura-user-id": user_id,
        "x-hasura-default-role": "moped-viewer",
        "x-hasura-allowed-roles": roles,
    }


def put_claims(user_id: str, claims: dict):
    """
    Sets claims in DynamoDB
    :param str user_id: The user id to set the claims for
    :return [str]: The claims string (encrypted)
    """
    fernet_key = get_secret(AWS_COGNITO_DYNAMO_SECRET_NAME)
    claims_str = json.dumps(claims)
    encrypted_claims = encrypt(fernet_key=fernet_key, content=claims_str)
    dynamodb = boto3.client("dynamodb", region_name="us-east-1")
    dynamodb.put_item(
        TableName=AWS_COGNITO_DYNAMO_TABLE_NAME,
        Item={"user_id": {"S": user_id}, "claims": {"S": encrypted_claims}},
    )

