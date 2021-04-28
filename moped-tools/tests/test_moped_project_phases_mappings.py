#!/usr/bin/env python
import pytest, json, pdb

from migration.moped_project_phases_mappings import *


class TestMopedProjectPhasesMappings:

    @classmethod
    def setup_class(cls) -> None:
        # Gives us access to the app class
        pass

    @classmethod
    def teardown_class(cls) -> None:
        # Discards the app instance we have
        pass

    def test_get_phase_id(self) -> None:
        """
        Basic testing of the Cerberus validator
        """
        assert get_phase_id("canceled") is None
        assert get_phase_id("hold") is None
        assert get_phase_id("removed") is None
        assert get_phase_id("construction") == 9
        assert get_phase_id("construction ready") == 8
        assert get_phase_id("design") == 6
        assert get_phase_id("planned") == 2
        assert get_phase_id("potential") == 1
        assert get_phase_id({}) is None
        assert get_phase_id(None) is None
        assert get_phase_id("") is None
        assert get_phase_id(123) is None

    def test_get_moped_phase_name(self) -> None:
        assert get_moped_phase_name("100% design") == "design"
        assert get_moped_phase_name("90% design") == "design"
        assert get_moped_phase_name("60% design") == "design"
        assert get_moped_phase_name("complete") == "complete"
        assert get_moped_phase_name("unlikely") == "potential"

        assert get_moped_phase_name("removed") is None
        assert get_moped_phase_name("_removed") is None
        assert get_moped_phase_name("") is None
        assert get_moped_phase_name({}) is None
        assert get_moped_phase_name(123) is None
        assert get_moped_phase_name(None) is None

    def test_get_moped_status_name(self) -> None:
        assert get_moped_status_name("100% design") == "active"
        assert get_moped_status_name("design by others") == "active"
        assert get_moped_status_name("potential") == "potential"
        assert get_moped_status_name("procurement") == "active"
        assert get_moped_status_name("substantially complete") == "complete"
        assert get_moped_status_name("removed") == "archived"

        assert get_moped_status_name(None) is None
        assert get_moped_status_name("") is None
        assert get_moped_status_name({}) is None
        assert get_moped_status_name(123) is None

    def test_get_moped_subphase_id(self) -> None:
        """
        None
        :return:
        """
        assert get_moped_subphase_id("complete - minor modifications in progress") == 10
        assert get_moped_subphase_id("design by others") == 8
        assert get_moped_subphase_id("post-inst. study") == 1
        assert get_moped_subphase_id("potential - feasibility study") == 11
        assert get_moped_subphase_id("procurement") == 2

        assert get_moped_subphase_id(None) is None
        assert get_moped_subphase_id("") is None
        assert get_moped_subphase_id({}) is None
        assert get_moped_subphase_id(123) is None
