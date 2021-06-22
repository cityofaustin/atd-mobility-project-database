#!/usr/bin/env python
import pytest, json, pdb
from pytest_mock import MockerFixture
from .helpers import *

import app


class TestApp:

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

    def test_is_valid_hasura_event(self) -> None:
        """
        Basic testing of the Cerberus validator
        """
        valid, errors = app.validate_hasura_event(self.event_insert)
        assert valid
        assert errors == {}

        valid, errors = app.validate_hasura_event(self.event_update)
        assert valid
        assert errors == {}

        valid, errors = app.validate_hasura_event(None)
        assert valid == False
        assert errors != {}

    def test_get_event_type(self) -> None:
        """
        Basic testing of the Cerberus validator
        """
        event_type = app.get_event_type(self.event_insert)
        assert event_type == "moped_project"

        event_type = app.get_event_type(self.event_update)
        assert event_type == "moped_project"

        event_type = app.get_event_type(None)
        assert event_type == ""

    def test_app_handler(self, mocker: MockerFixture) -> None:
        """
        Makes sure that the app handler runs the process_event method
        :param mocker:
        :type mocker: MockerFixture
        """
        mocker.patch.object(app, 'process_event', autospec=True)
        mock_event = create_sqs_event(self.event_update)
        app.handler(mock_event, {"function_name": "test", "aws_request_id": "test"})
        app.process_event.assert_called_once_with(mock_event["Records"][0]["body"])

    def test_event_handler_validate_hasura_event(self, mocker: MockerFixture) -> None:
        """
        Makes sure that event handler executes as expected
        """
        mocker.patch.object(app,
            "validate_hasura_event",
            return_value=(False, dict(success="test")),
            autospec=True
        )

        # Execute process_event, expecting an exception
        with pytest.raises(Exception):
            app.process_event(self.event_update)

        # Make sure it gets called
        app.validate_hasura_event.assert_called_once_with(self.event_update)
        mocker.stopall()

    def test_event_handler_get_event_type(self, mocker: MockerFixture) -> None:
        """
        Makes sure that event handler executes as expected
        """
        # Patch validate_hasura_event
        mocker.patch.object(app,
            "get_event_type",
            return_value="",
            autospec=True
        )
        # Execute process_event, expecting an exception
        with pytest.raises(Exception):
            app.process_event(self.event_update)

        # Make sure it gets called
        app.get_event_type.assert_called_once_with(self.event_update)
        mocker.stopall()
