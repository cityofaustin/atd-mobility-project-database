
def split_name(full_name: str, index: int) -> str:
    """
    Split a full name into first and last name
    :param str full_name: The full name
    :param int index: the index 0 is first name, the index 1 is last name
    :return str:
    """
    names = str(full_name).split(" ")

    try:
        return names[index]
    except IndexError:
        return ""

def generate_email(full_name: str) -> str:
    """
    Generates an email address for an employee
    :param str full_name: The full name of the user
    :return str:
    """
    first_name = split_name(full_name, 0)
    last_name = split_name(full_name, 1)
    return f"{first_name}.{last_name}@austintexas.gov"


def get_org_workgroup_id(access_org: str) -> str:
    """
    Returns the Moped Workgroup ID equivalent for each of the access database organizations
    :param str access_org: The access organization
    :return str:
    """
    return {
        "_unknown": 18,
        "atd": 18,
        "atd_activetrans": 1,
        "atd_amd": 2,
        "atd_amd_datacollection": 2,
        "atd_devreview": 18,
        "atd_systemdev": 18,
        "atd_ted": 18,
        "atd_ted_latm": 18,
        "atd_ted_ppd": 18,
        "atd_ted_safety": 18,
        "atd_ted_transitep": 18,
        "coa_pwd": 18,
        "coa_pwd_sidewalkspd": 18,
        "coa_pwd_srts": 18,
        "coa_pwd_urbantrails": 18,
        "consultant_mwm": 18,
        "consultant_rps": 18,
    }.get(
        # Lower-case the value in access_org
        str(access_org).lower(),
        # The default value in case it can't find access_org in the dictionary
        18
    )


def get_workgroup_name(workgroup_id: int) -> str:
    """
    Turns a workgroup_id into a string
    :param int workgroup_id: The workgroup id number
    :return str: The name of the workgroup
    """
    return {
        "1": "Active Transportation & Street Design",
        "2": "Arterial Management",
        "3":"Data & Technology Services",
        "4":"Finance",
        "5":"Human Resources",
        "6":"Office of Special Events",
        "7":"Office of the Director",
        "8":"Parking Enterprise",
        "9":"Parking Meters",
        "10":"Public Information Office",
        "11":"Right-of-Way",
        "12":"Signs & Markings",
        "13":"Smart Mobility",
        "14":"Systems Development",
        "15":"Transportation Engineering",
        "16":"Transportation Development Services",
        "17":"Vision Zero",
        "18":"Other",
    }.get(
        # Return Other if it can't find it
        str(workgroup_id), "Other"
    )


def is_coa_staff(email: str) -> bool:
    return email.endswith("@austintexas.gov")
