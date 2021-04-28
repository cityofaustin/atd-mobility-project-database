import requests
from requests import Response

def run_query(query: str, object: dict = None, variables: dict = None) -> Response:
    """
    Makes a request to the Hasura GraphQL endpoint
    :param str query: The GraphQL query to be executed
    :param dict object: The array of objects to be provided to the query
    :param dict variables: A dictionary with the variables to be provided to Hasura
    :return dict: The response from Hasura as a dictionary
    """

    response = requests.post(
        url="http://localhost:8080/v1/graphql",
        headers={
            "Accept": "*/*",
            "content-type": "application/json",
            # "x-hasura-admin-secret": HERE_GOES_THE_SECRET
        },
        json={
            "query": query,
            "variables": {
                **({} if variables is None else variables),
                **({} if object is None else {"object":  object}),
            }
        }
    )
    
    response.encoding = "utf-8"
    return response.json()


def run_sql(query: str) -> Response:
    """
    Makes a request to the Hasura GraphQL endpoint
    :param str query: The PostgreSQL query to be executed
    :return dict: The response from Hasura as a dictionary
    """

    response = requests.post(
        url="http://localhost:8080/v1/query",
        headers={
            "Accept": "*/*",
            "content-type": "application/json",
            # "x-hasura-admin-secret": HERE_GOES_THE_SECRET
        },
        json={
            "type": "run_sql",
            "args": {
                "sql": query
            }
        }
    )
    response.encoding = "utf-8"
    return response
