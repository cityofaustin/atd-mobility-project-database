#!/usr/bin/env python
import pdb
from MopedEvent import MopedEvent

from .helpers import *
from config import *

class TestMopedEvent:
    @classmethod
    def setup_class(cls) -> None:
        # Gives us access to the app class
        cls.event_update = load_json_file("tests/moped_project/dummy_event_update.json")
        cls.event_insert = load_json_file("tests/moped_project/dummy_event_insert.json")

    @classmethod
    def teardown_class(cls) -> None:
        # Discards the app instance we have
        cls.event_update = None
        cls.event_insert = None

    def test_init(self) -> None:
        """
        Tests whether the primary keys are going to be loaded
        """
        moped_event = MopedEvent(payload=self.event_update, load_primary_keys=False)
        assert len(moped_event.MOPED_PRIMARY_KEY_MAP.keys()) == 0
        assert moped_event.HASURA_EVENT_VALIDATION_SCHEMA is not None
        assert moped_event.HASURA_EVENT_PAYLOAD != {}

        moped_event = MopedEvent(payload=self.event_update, load_primary_keys=False)
        assert len(moped_event.MOPED_PRIMARY_KEY_MAP.keys()) == 0
        assert moped_event.HASURA_EVENT_VALIDATION_SCHEMA is not None
        assert moped_event.HASURA_EVENT_PAYLOAD != {}

        moped_event = MopedEvent(payload=None, load_primary_keys=False)
        assert len(moped_event.MOPED_PRIMARY_KEY_MAP.keys()) == 0
        assert moped_event.HASURA_EVENT_VALIDATION_SCHEMA is not None
        assert moped_event.HASURA_EVENT_PAYLOAD is None

    def test_get_primary_key(self) -> None:
        """
        Tests if we can get a primary key (once map is loaded)
        """
        moped_event = MopedEvent(self.event_update)

        assert moped_event.MOPED_PRIMARY_KEY_MAP.keys is not None
        assert moped_event != {}
        assert "moped_activity_log" in moped_event.MOPED_PRIMARY_KEY_MAP
        assert "activity_id" == moped_event.get_primary_key("moped_activity_log")
        assert "user_id" == moped_event.get_primary_key("moped_users")
        assert "project_id" == moped_event.get_primary_key("moped_project")
        assert moped_event.get_primary_key("nowhere_to_be_found") is None
        assert moped_event.get_primary_key(None) is None

    def test_repr(self) -> None:
        moped_event = MopedEvent(payload=self.event_update, load_primary_keys=False)
        assert repr(moped_event) == "MopedEvent(moped_project)"

        moped_event = MopedEvent(payload=self.event_insert, load_primary_keys=False)
        assert repr(moped_event) == "MopedEvent(moped_project)"

        moped_event = MopedEvent(payload=None, load_primary_keys=False)
        assert repr(moped_event) == "MopedEvent()"

    def test_str(self) -> None:
        moped_event = MopedEvent(payload=self.event_update, load_primary_keys=False)
        assert is_str_dict(str(moped_event))

        moped_event = MopedEvent(payload=self.event_insert, load_primary_keys=False)
        assert is_str_dict(str(moped_event))

        moped_event = MopedEvent(payload=None, load_primary_keys=False)
        assert str(moped_event) == "null"

    def test_get_state(self) -> None:
        moped_event = MopedEvent(payload=self.event_update, load_primary_keys=False)
        state = moped_event.get_state("new")
        assert isinstance(state, dict)
        assert "project_priority" in state
        assert state["project_priority"] == "High"

        state = moped_event.get_state("old")
        assert isinstance(state, dict)
        assert "project_priority" in state
        assert state["project_priority"] == "Low"

        moped_event = MopedEvent(payload=self.event_insert, load_primary_keys=False)
        assert moped_event.get_state("old") is None

        moped_event = MopedEvent(payload=None, load_primary_keys=False)
        assert isinstance(state, dict)
        assert moped_event.get_state("old") == {}

    def test_get_event_session_var(self) -> None:
        moped_event = MopedEvent(payload=self.event_update, load_primary_keys=False)
        assert moped_event.get_event_session_var("x-hasura-user-id") == "7eee07c6-5f50-11eb-8ea9-371fc07428f6"

        moped_event = MopedEvent(payload=self.event_insert, load_primary_keys=False)
        assert moped_event.get_event_session_var("x-hasura-user-id") == "azuread_dummy.user@none.org"

        moped_event = MopedEvent(payload=None, load_primary_keys=False)
        assert moped_event.get_event_session_var("x-hasura-user-id") == None

    def test_payload(self) -> None:
        moped_event = MopedEvent(payload=self.event_update, load_primary_keys=False)
        assert isinstance(moped_event.payload(), dict)
        assert moped_event.payload() != {}
        assert "event" in moped_event.payload()

        moped_event = MopedEvent(payload=self.event_insert, load_primary_keys=False)
        assert isinstance(moped_event.payload(), dict)
        assert moped_event.payload() != {}
        assert "event" in moped_event.payload()

        moped_event = MopedEvent(payload=None, load_primary_keys=False)
        assert moped_event.payload() is None

    def test_can_validate(self) -> None:
        moped_event = MopedEvent(payload=self.event_update, load_primary_keys=False)
        assert moped_event.can_validate()

        moped_event = MopedEvent(payload=self.event_insert, load_primary_keys=False)
        assert moped_event.can_validate()

        moped_event = MopedEvent(payload=None, load_primary_keys=False)
        assert moped_event.can_validate()

    def test_diff(self) -> None:
        moped_event = MopedEvent(payload=self.event_update, load_primary_keys=False)
        diff = moped_event.get_diff()
        assert isinstance(diff, list)
        assert len(diff) == 2
        assert diff[0]["field"] == "project_priority"
        assert diff[0]["old"] == "Low"
        assert diff[0]["new"] == "High"
        assert diff[1]["field"] == "project_name"
        assert diff[1]["old"] == "Project name old state"
        assert diff[1]["new"] == "Project name new state"

        moped_event = MopedEvent(payload=None, load_primary_keys=False)
        diff = moped_event.get_diff()
        assert isinstance(diff, list)
        assert len(diff) == 0

    def test_get_variables_success(self) -> None:
        moped_event = MopedEvent(payload=self.event_update, load_primary_keys=True)
        variables = moped_event.get_variables()
        assert isinstance(variables, dict)
        assert "recordId" in variables
        assert "recordType" in variables
        assert "recordData" in variables
        assert "description" in variables
        assert "updatedBy" in variables

        assert variables.get("recordId", 0) == 1
        assert variables.get("recordType", "") == "moped_project"

        assert variables.get("recordData", None) is not None
        assert isinstance(variables.get("recordData", None), dict)

        assert variables.get("description", None) is not None
        assert isinstance(variables.get("description", None), list)
        assert len(variables.get("description")) == 2

        assert variables.get("updatedBy", "") == "7eee07c6-5f50-11eb-8ea9-371fc07428f6"

    def test_get_variables_fail(self) -> None:
        moped_event = MopedEvent(payload=None, load_primary_keys=True)
        try:
            moped_event.get_variables()
            assert False
        except KeyError:
            assert True

    def test_request(self) -> None:
        if HASURA_ENDPOINT == "":
            print("Cannot test without HASURA_ENDPOINT")
            assert True
            return

        print("HASURA_ADMIN_SECRET: " + HASURA_ADMIN_SECRET)
        print("HASURA_ENDPOINT: " + HASURA_ENDPOINT)

        moped_event = MopedEvent(payload=self.event_update, load_primary_keys=True)
        response = moped_event.request(variables=moped_event.get_variables())
        assert isinstance(response, dict)
        assert "data" in response
        assert "insert_moped_activity_log" in response["data"]
        assert "affected_rows" in response["data"]["insert_moped_activity_log"]
        assert response["data"]["insert_moped_activity_log"]["affected_rows"] == 1
