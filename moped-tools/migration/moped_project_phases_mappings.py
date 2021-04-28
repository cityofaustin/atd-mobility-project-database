#
# Current phases mapping
#

MOPED_PHASES = {
    1: "potential",
    2: "planned",
    3: "preliminary engineering",
    4: "scoping",
    5: "preliminary design",
    6: "design",
    7: "pre-construction",
    8: "construction-ready",
    9: "construction",
    10: "post-construction",
    11: "complete",
}

#
# Current subphases mapping
#

MOPED_SUBPHASE = {
    1: "Post-inst. study",
    2: "Procurement",
    3: "Permitting",
    4: "Study in progress",
    5: "Active development review",
    6: "Below ground construction",
    7: "Above ground construction",
    8: "Design by others",
    9: "Environmental study in progress",
    10: "Minor modifications in progress",
    11: "Feasibility study",
}

#
# Current statuses
#
MOPED_STATUS = {
    1: "active",
    2: "potential",
    3: "complete",
    4: "canceled",
    5: "hold",
    6: "archived",
}

MOPED_MILESTONES = {
    3: "actual construction start date",
    4: "actual end date",
    5: "actual resurfacing date",
    9: "resurfacing date",
    10: "check in on project status",
    11: "public meeting",
}

ACCESS_PHASES_TO_MOPED_PHASES = {
    "canceled": {
        "moped_phase_id": None,
        "moped_subphase_id": None,
        "moped_status_id": 4,
        "moped_milestone": None,
    },
    "corridorplan - corridor funding available": {
        "moped_phase_id": None,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "corridorplan - environmental study in progress": {
        "moped_phase_id": None,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "corridorplan - environmentally cleared": {
        "moped_phase_id": None,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "corridorplan - planning process - complete": {
        "moped_phase_id": None,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "corridorplan - planning process - in progress": {
        "moped_phase_id": None,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "hold": {
        "moped_phase_id": None,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "removed": {
        "moped_phase_id": None,
        "moped_subphase_id": None,
        "moped_status_id": 6,
        "moped_milestone": None,
    },

    "100% design": {
        "moped_phase_id": 6,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "30% design": {
        "moped_phase_id": 6,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "60% design": {
        "moped_phase_id": 6,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "90% design": {
        "moped_phase_id": 6,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "complete": {
        "moped_phase_id": 11,
        "moped_subphase_id": None,
        "moped_status_id": 3,
        "moped_milestone": None,
    },
    "complete - minor modifications in progress": {
        "moped_phase_id": 11,
        "moped_subphase_id": 10,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "construction": {
        "moped_phase_id": 9,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "construction ready": {
        "moped_phase_id": 8,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "design": {
        "moped_phase_id": 6,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "design - initial field visit": {
        "moped_phase_id": 6,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "design - preliminary schematic complete": {
        "moped_phase_id": 6,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "design by others": {
        "moped_phase_id": 6,
        "moped_subphase_id": 8,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "planned": {
        "moped_phase_id": 2,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "planned - coordination needed": {
        "moped_phase_id": 2,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "planned - resurfacing not required": {
        "moped_phase_id": 2,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "planned - resurfacing scheduled": {
        "moped_phase_id": 2,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "post construction": {
        "moped_phase_id": 10,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "post-inst. study": {
        "moped_phase_id": 10,
        "moped_subphase_id": 1,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "potential": {
        "moped_phase_id": 1,
        "moped_subphase_id": None,
        "moped_status_id": 2,
        "moped_milestone": None,
    },
    "potential - active development review": {
        "moped_phase_id": 1,
        "moped_subphase_id": None,
        "moped_status_id": 2,
        "moped_milestone": None,
    },
    "potential - feasibility study": {
        "moped_phase_id": 1,
        "moped_subphase_id": 11,
        "moped_status_id": 2,
        "moped_milestone": None,
    },
    "potential - need to request resurfacing": {
        "moped_phase_id": 1,
        "moped_subphase_id": None,
        "moped_status_id": 2,
        "moped_milestone": None,
    },
    "potential - reconstruction priority": {
        "moped_phase_id": 1,
        "moped_subphase_id": None,
        "moped_status_id": 2,
        "moped_milestone": None,
    },
    "potential - resurfacing deferred": {
        "moped_phase_id": 1,
        "moped_subphase_id": None,
        "moped_status_id": 2,
        "moped_milestone": None,
    },
    "potential - resurfacing not required": {
        "moped_phase_id": 1,
        "moped_subphase_id": None,
        "moped_status_id": 2,
        "moped_milestone": None,
    },
    "potential - resurfacing requested": {
        "moped_phase_id": 1,
        "moped_subphase_id": None,
        "moped_status_id": 2,
        "moped_milestone": None,
    },
    "potential - resurfacing scheduled": {
        "moped_phase_id": 1,
        "moped_subphase_id": None,
        "moped_status_id": 2,
        "moped_milestone": None,
    },
    "preliminary design": {
        "moped_phase_id": 5,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "preliminary engineering": {
        "moped_phase_id": 3,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "procurement": {
        "moped_phase_id": 7,
        "moped_subphase_id": 2,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "resurfaced - on hold": {
        "moped_phase_id": 1,
        "moped_subphase_id": None,
        "moped_status_id": 5,
        "moped_milestone": None,
    },
    "scheduled for construction": {
        "moped_phase_id": 8,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "scoping": {
        "moped_phase_id": 4,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    },
    "substantially complete": {
        "moped_phase_id": 11,
        "moped_subphase_id": None,
        "moped_status_id": 3,
        "moped_milestone": None,
    },
    "tbd": {
        "moped_phase_id": 1,
        "moped_subphase_id": None,
        "moped_status_id": 2,
        "moped_milestone": None,
    },
    "unlikely": {
        "moped_phase_id": 1,
        "moped_subphase_id": None,
        "moped_status_id": 2,
        "moped_milestone": None,
    },
    "work order submitted": {
        "moped_phase_id": 8,
        "moped_subphase_id": None,
        "moped_status_id": 1,
        "moped_milestone": None,
    }
}


def get_phase_id(access_phase_name: str) -> int:
    """
    Using the access phase name, retrieves the moped phase id
    :param str access_phase_name: The access phase name
    :return int:
    """
    if not isinstance(access_phase_name, str):
        return None

    return ACCESS_PHASES_TO_MOPED_PHASES.get(
        access_phase_name, {}
    ).get("moped_phase_id")


def get_moped_phase_name(access_phase_name: str) -> str:
    """
    Using the access phase name, retrieves the moped phase name
    :param str access_phase_name: The access phase name
    :return str:
    """
    if not isinstance(access_phase_name, str):
        return None

    moped_phase_id = get_phase_id(access_phase_name)
    
    # Loop through each phase and if the ID is the same, return the name
    return MOPED_PHASES.get(moped_phase_id, None)


def get_moped_status_name(access_phase_name: str) -> str:
    """
    Retrieves the status name
    :param str access_phase_name:
    :return:
    """
    print("Status for: " + access_phase_name)
    if not isinstance(access_phase_name, str):
        return None

    moped_status_id = ACCESS_PHASES_TO_MOPED_PHASES.get(
        access_phase_name, {}
    ).get("moped_status_id", None)

    return MOPED_STATUS.get(moped_status_id, None)


def get_moped_subphase_id(access_phase_name: str) -> str:
    """
    Retrieves the status name
    :param str access_phase_name:
    :return:
    """
    if not isinstance(access_phase_name, str):
        return None

    return ACCESS_PHASES_TO_MOPED_PHASES.get(
        access_phase_name, {}
    ).get("moped_subphase_id", None)

