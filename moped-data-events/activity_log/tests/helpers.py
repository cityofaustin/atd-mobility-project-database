import json


def load_json_file(file: str) -> dict:
    """
    Parses a JSON from file
    :param file: File name
    :type file: str
    :return: The file contents as a dictionary
    :rtype: dict
    """
    with open(file) as filePointer:
        return json.load(fp=filePointer)


def create_sqs_event(event: dict) -> dict:
    """
    Wraps the event in an SQS-like format
    :param event: The event dictionary
    :type event: dict
    :return: The "Records" dictionary
    :rtype: dict
    """
    return {
        "Records": [
            {
                "body": json.dumps(event)
            }
        ]
    }


def is_str_dict(string: str) -> bool:
    """
    Returns True if a string is a valid dictionary
    :param string: The dictionary to be evaluated
    :type string: str
    :return: True if the string is a parsable json
    :rtype: bool
    """
    try:
        json.loads(string)
        return True
    except:
        return False