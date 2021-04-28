-- INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('CIP', 1, true, NULL, NULL, 1, '2020-10-09 13:37:32.779628+00');
INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('Lane Conversion', 2, true, NULL, NULL, 2, '2020-10-09 13:37:50.460015+00');
INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('Parking Mod', 3, true, NULL, NULL, 3, '2020-10-09 13:38:56.504668+00');
INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('Private Development', 4, true, NULL, NULL, 10, '2020-10-09 13:39:09.593212+00');
INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('New Road', 5, true, NULL, NULL, 6, '2020-10-09 13:39:23.93937+00');
INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('Plan', 6, true, NULL, NULL, 8, '2020-10-09 13:39:31.616226+00');
INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('Operations', 7, true, NULL, NULL, 9, '2020-10-09 13:39:41.544508+00');
INSERT INTO public.moped_categories (category_name, category_id, active_category, on_street, sensitivity, category_order, date_added) VALUES ('Lane Width', 8, true, NULL, NULL, 12, '2020-10-09 13:39:51.594248+00');
INSERT INTO public.moped_city_fiscal_years (fiscal_year_value, fiscal_year_start_date, fiscal_year_end_date, active_fy) VALUES ('2016', NULL, NULL, NULL);
INSERT INTO public.moped_city_fiscal_years (fiscal_year_value, fiscal_year_start_date, fiscal_year_end_date, active_fy) VALUES ('2017', NULL, NULL, NULL);
INSERT INTO public.moped_city_fiscal_years (fiscal_year_value, fiscal_year_start_date, fiscal_year_end_date, active_fy) VALUES ('2018', NULL, NULL, NULL);
INSERT INTO public.moped_city_fiscal_years (fiscal_year_value, fiscal_year_start_date, fiscal_year_end_date, active_fy) VALUES ('2019', NULL, NULL, NULL);
INSERT INTO public.moped_city_fiscal_years (fiscal_year_value, fiscal_year_start_date, fiscal_year_end_date, active_fy) VALUES ('2021', NULL, NULL, true);
INSERT INTO public.moped_city_fiscal_years (fiscal_year_value, fiscal_year_start_date, fiscal_year_end_date, active_fy) VALUES ('2020', NULL, NULL, false);
-- Insert Workgroup IDs
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Active Transportation & Street Design', 1, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Arterial Management', 2, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Data & Technology Services', 3, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Finance', 4, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Human Resources', 5, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Office of Special Events', 6, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Office of the Director', 7, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Parking Enterprise', 8, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Parking Meters', 9, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Public Information Office', 10, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Right-of-Way', 11, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Signs & Markings', 12, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Smart Mobility', 13, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Systems Development', 14, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Transportation Engineering', 15, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Transportation Development Services', 16, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Vision Zero', 17, '2020-12-04 16:53:02.752811+00');
INSERT INTO public.moped_workgroup (workgroup_name, workgroup_id, date_added) VALUES ('Other', 18, '2020-12-04 16:53:02.752811+00');
-- Done inserting workgroups
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, email, status_id, roles) VALUES ('9699d49f-c5ba-4dad-b286-510a5e178aa7', 'JD', 'Maccombs', 'Developer', 'Data & Technology Services', 1, 3, NULL, '2020-10-09 13:44:02.159095+00', 'jd.mccombs@emailhost.xyz', 1, '["moped-editor"]');
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, email, status_id, roles) VALUES ('9972fa62-1bbd-4f58-9b7d-80b9bc73a537', 'Mike', 'Schofield', 'Engineer', 'Active Transportation & Street Design', 3, 1, NULL, '2020-10-09 13:44:02.15918+00', 'ms@emailhost.xyz', 1, '["moped-editor"]');
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, email, status_id, roles) VALUES ('e6bb053b-d6bf-4460-b9a5-c5cb7021958d', 'Nathan', 'Wilkes', 'Engineer', 'Active Transportation & Street Design', 2, 1, NULL, '2020-10-09 13:44:02.159184+00', 'nw@emailhost.xyz', 1, '["moped-editor"]');
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, email, status_id, roles) VALUES ('c1fab7c1-a8ef-4b53-8016-6b9f47db9a01', 'Sergio', 'Garcia', 'Developer', 'Data & Technology Services', 7, 3, NULL, '2020-10-09 13:44:02.159095+00', 'sergio.garcia@emailhost.xyz', 1, '["moped-admin"]');
INSERT INTO public.moped_entity (entity_uuid, workgroup_name, abbreviated_name, entity_id, affiliated_workgroup, date_added) VALUES ('f30415c5-0b5d-4d92-bb04-7c4f0ea13288', 'Capital Metro', 'CapMetro', 1, NULL, '2020-10-09 13:44:36.783377+00');

--
-- Milestones
--
INSERT INTO public.moped_milestones (milestone_name, milestone_description, milestone_order, required_milestone, milestone_id) VALUES ('actual construction start date', '', 7, true, 3);
INSERT INTO public.moped_milestones (milestone_name, milestone_description, milestone_order, required_milestone, milestone_id) VALUES ('actual end date', '', 1, true, 4);
INSERT INTO public.moped_milestones (milestone_name, milestone_description, milestone_order, required_milestone, milestone_id) VALUES ('actual resurfacing date', '', 8, true, 5);
INSERT INTO public.moped_milestones (milestone_name, milestone_description, milestone_order, required_milestone, milestone_id) VALUES ('resurfacing date', '', 8, false, 9);
INSERT INTO public.moped_milestones (milestone_name, milestone_description, milestone_order, required_milestone, milestone_id) VALUES ('check in on project status', '', 20, true, 10);
INSERT INTO public.moped_milestones (milestone_name, milestone_description, milestone_order, required_milestone, milestone_id) VALUES ('public meeting', '', 21, true, 11);

--
-- Phases
--
-- For now, we have removed phases seeds since they are being inserted in the migrations.

--
-- Projects
--
INSERT INTO public.moped_project (project_uuid, project_name, project_description, project_description_public, "ecapris_subproject_id", project_importance, project_order, current_status, project_id, timeline_id, current_phase, end_date, project_length, start_date, fiscal_year, capitally_funded, project_priority, date_added, added_by) VALUES ('e3bd46b2-2a80-486a-b1d2-99be709b73d5', 'Dobie Middle Phase 1', 'feasibility study for bike lanes near Dobie MS', null, null, null, null, 'Active', 1, null, 'Planned', null, null, '2020-04-20', '2020', false, 'Low', '2020-12-16 19:41:25.734687', null);
INSERT INTO public.moped_project (project_uuid, project_name, project_description, project_description_public, "ecapris_subproject_id", project_importance, project_order, current_status, project_id, timeline_id, current_phase, end_date, project_length, start_date, fiscal_year, capitally_funded, project_priority, date_added, added_by) VALUES ('011c34b9-1514-498a-a8ed-067ba5a37638', 'Cook Elementary Phase 2', 'Curb extensions in coordination with sidewalk rehab project', null, null, null, null, 'Hold', 2, null, 'Hold', null, null, '2020-10-12', '2021', false, 'Medium', '2020-12-16 19:41:25.734931', null);
INSERT INTO public.moped_project (project_uuid, project_name, project_description, project_description_public, "ecapris_subproject_id", project_importance, project_order, current_status, project_id, timeline_id, current_phase, end_date, project_length, start_date, fiscal_year, capitally_funded, project_priority, date_added, added_by) VALUES ('03bdea56-d6f7-40f8-9827-76a473beddf7', 'Southern Walnut Creek Trail', 'Southern Walnut Creek Trail connection from Alta Trailhead development', null, null, null, null, 'Active', 3, null, 'Construction', null, null, '2019-11-12', '2020', false, 'Low', '2020-12-16 19:41:25.735082', null);
INSERT INTO public.moped_project (project_uuid, project_name, project_description, project_description_public, "ecapris_subproject_id", project_importance, project_order, current_status, project_id, timeline_id, current_phase, end_date, project_length, start_date, fiscal_year, capitally_funded, project_priority, date_added, added_by) VALUES ('d91c240e-777e-4bed-befa-12b29b22dd17', 'Lamar and Koenig Development SUP', '5629 N. Lamar development of the large triangle on the SE corner is proposing to change the slip lane to a smart right and build a 10'' SUP along N. Lamar, set back with 10'' planting area.', null, null, null, null, 'Potential', 4, null, 'Potential', null, null, '2018-10-30', '2019', false, 'Low', '2020-12-16 19:41:25.735226', null);
INSERT INTO public.moped_project (project_uuid, project_name, project_description, project_description_public, "ecapris_subproject_id", project_importance, project_order, current_status, project_id, timeline_id, current_phase, end_date, project_length, start_date, fiscal_year, capitally_funded, project_priority, date_added, added_by) VALUES ('4dddbdc2-db49-4e19-b81f-17dc76ff5d2e', 'Burnet Rd. at Rutland Dr._2018 Transit', 'Add bus stop concrete pad to median and tighten slip lane to create a safer crossing', null, null, null, null, 'Complete', 5, null, 'Complete', null, null, '2018-08-07', '2019', false, 'Low', '2020-12-16 19:41:25.735364', null);
INSERT INTO public.moped_project (project_uuid, project_name, project_description, project_description_public, "ecapris_subproject_id", project_importance, project_order, current_status, project_id, timeline_id, current_phase, end_date, project_length, start_date, fiscal_year, capitally_funded, project_priority, date_added, added_by) VALUES ('d6b5a146-386b-4b78-9e33-312187fd6263', 'Tilley at 51st Street intersection fix', 'Improvements to geometry of partial protected intersection constructed by Catellus at Tilley and 51st Street', null, null, null, null, 'Active', 6, null, 'Design', null, null, '2019-06-10', '2019', false, 'Medium', '2020-12-16 19:41:25.735499', null);
INSERT INTO public.moped_project (project_uuid, project_name, project_description, project_description_public, "ecapris_subproject_id", project_importance, project_order, current_status, project_id, timeline_id, current_phase, end_date, project_length, start_date, fiscal_year, capitally_funded, project_priority, date_added, added_by) VALUES ('a5342871-f316-4cf3-90d5-38e08978e99b', 'HW 360 Westlake Drive/Cedar Street Project', 'Project as part of TXDOT HW 360 program', null, null, null, null, 'Active', 7, null, 'Planned', null, null, '2020-08-27', '2021', false, 'Medium', '2020-12-16 19:41:25.738888', null);

--
-- Project Milestones
--
INSERT INTO public.moped_proj_milestones (milestone_name, milestone_description, milestone_order, milestone_start, milestone_end, milestone_length, milestone_privacy, days_left, is_current_milestone, completed, project_milestone_id, project_id, project_timeline_id, milestone_owner_id, date_added) VALUES ('check in on project status', '', 7, '2020-05-20', '2020-06-20', 30, true, 0, false, false, 1, 1, 1, NULL, '2020-10-09 14:35:56.695504+00');
INSERT INTO public.moped_proj_milestones (milestone_name, milestone_description, milestone_order, milestone_start, milestone_end, milestone_length, milestone_privacy, days_left, is_current_milestone, completed, project_milestone_id, project_id, project_timeline_id, milestone_owner_id, date_added) VALUES ('actual resurfacing date', NULL, 8, '2020-04-04', '2020-10-10', NULL, NULL, 65, true, false, 2, 2, NULL, NULL, '2020-10-09 14:35:56.695654+00');
INSERT INTO public.moped_proj_milestones (milestone_name, milestone_description, milestone_order, milestone_start, milestone_end, milestone_length, milestone_privacy, days_left, is_current_milestone, completed, project_milestone_id, project_id, project_timeline_id, milestone_owner_id, date_added) VALUES ('public meeting', NULL, 15, '2020-04-05', '2020-10-11', NULL, NULL, 66, true, false, 3, 3, NULL, NULL, '2020-10-09 14:35:56.695658+00');

--
-- Projet Phases
--
INSERT INTO public.moped_proj_phases (phase_name, phase_description, phase_rank, completion_percentage, phase_status, phase_privacy, phase_start, phase_end, phase_priority, is_current_phase, completed, project_phase_id, project_id, started_by_user_id, completed_by_user_id, date_added) VALUES ('construction', NULL, NULL, 1, NULL, NULL, NULL, NULL, 1, NULL, true, 1, 1, NULL, NULL, '2020-10-09 14:39:05.06761+00');
INSERT INTO public.moped_proj_phases (phase_name, phase_description, phase_rank, completion_percentage, phase_status, phase_privacy, phase_start, phase_end, phase_priority, is_current_phase, completed, project_phase_id, project_id, started_by_user_id, completed_by_user_id, date_added) VALUES ('complete', NULL, NULL, 100, NULL, NULL, '2020-04-01', '2020-04-11', 3, NULL, true, 2, 2, NULL, NULL, '2020-10-09 14:39:05.067764+00');
INSERT INTO public.moped_proj_phases (phase_name, phase_description, phase_rank, completion_percentage, phase_status, phase_privacy, phase_start, phase_end, phase_priority, is_current_phase, completed, project_phase_id, project_id, started_by_user_id, completed_by_user_id, date_added) VALUES ('construction', NULL, NULL, 100, NULL, NULL, '2020-08-10', NULL, 4, NULL, true, 3, 2, NULL, NULL, '2020-10-09 14:39:05.067767+00');

INSERT INTO public.moped_status (status_name, status_flag, status_priority, status_id) VALUES ('active', NULL, NULL, 1);
INSERT INTO public.moped_status (status_name, status_flag, status_priority, status_id) VALUES ('potential', NULL, NULL, 2);
INSERT INTO public.moped_status (status_name, status_flag, status_priority, status_id) VALUES ('complete', NULL, NULL, 3);
INSERT INTO public.moped_status (status_name, status_flag, status_priority, status_id) VALUES ('canceled', NULL, NULL, 4);
INSERT INTO public.moped_status (status_name, status_flag, status_priority, status_id) VALUES ('hold', NULL, NULL, 5);
INSERT INTO public.moped_proj_status_history (milestone_name, milestone_description, milestone_order, milestone_start, milestone_end, milestone_length, milestone_privacy, is_current_milestone, is_milestone_completed, status_name, project_status_history_id, date_status_changed, project_id, date_added, added_by) VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', 3, '2020-08-21', 1, '2020-10-09 14:42:06.598508+00', NULL);
INSERT INTO public.moped_proj_status_history (milestone_name, milestone_description, milestone_order, milestone_start, milestone_end, milestone_length, milestone_privacy, is_current_milestone, is_milestone_completed, status_name, project_status_history_id, date_status_changed, project_id, date_added, added_by) VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'canceled', 4, '2020-08-19', 1, '2020-10-09 14:42:06.598568+00', NULL);
INSERT INTO public.moped_proj_status_history (milestone_name, milestone_description, milestone_order, milestone_start, milestone_end, milestone_length, milestone_privacy, is_current_milestone, is_milestone_completed, status_name, project_status_history_id, date_status_changed, project_id, date_added, added_by) VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', 5, '2020-08-21', 2, '2020-10-09 14:42:06.598571+00', NULL);
INSERT INTO public.moped_proj_status_history (milestone_name, milestone_description, milestone_order, milestone_start, milestone_end, milestone_length, milestone_privacy, is_current_milestone, is_milestone_completed, status_name, project_status_history_id, date_status_changed, project_id, date_added, added_by) VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'potential', 6, '2020-08-15', 2, '2020-10-09 14:42:06.598574+00', NULL);
INSERT INTO public.moped_proj_timeline (active_phase, active_phase_start, active_phase_end, active_phase_length, active_milestone_start, active_milestone_end, active_milestone_length, current_status, capital_projects_explorer_id, timeline_id, project_id, active_milestone) VALUES ('Bidding', '2020-08-10', '2020-08-10', 5, '2020-05-30', '2020-09-30', 120, 'a', 'f', 2, 2, 'communications');
INSERT INTO public.moped_proj_timeline (active_phase, active_phase_start, active_phase_end, active_phase_length, active_milestone_start, active_milestone_end, active_milestone_length, current_status, capital_projects_explorer_id, timeline_id, project_id, active_milestone) VALUES ('Post Construction', '2020-08-01', '2020-08-10', 5, '2020-08-30', '2020-10-01', 61, 'active', 'F', 1, 1, 'Evaluation Post');
INSERT INTO public.moped_project_roles (project_role_id, project_role_name, active_role, role_order, date_added) VALUES (1, 'Project Manager', true, 1, '2020-10-09 14:43:03.85001+00');
INSERT INTO public.moped_project_roles (project_role_id, project_role_name, active_role, role_order, date_added) VALUES (5, 'Project Coordinator', true, 4, '2020-10-09 14:43:03.859535+00');
INSERT INTO public.moped_project_roles (project_role_id, project_role_name, active_role, role_order, date_added) VALUES (4, 'Design Review', true, 3, '2020-10-09 14:43:03.859537+00');
INSERT INTO public.moped_project_roles (project_role_id, project_role_name, active_role, role_order, date_added) VALUES (6, 'Design Support', true, 6, '2020-10-09 14:43:03.859539+00');
INSERT INTO public.moped_project_roles (project_role_id, project_role_name, active_role, role_order, date_added) VALUES (7, 'Design Consultant', true, 7, '2020-10-09 14:43:03.85954+00');
INSERT INTO public.moped_project_roles (project_role_id, project_role_name, active_role, role_order, date_added) VALUES (8, 'Public Process Support', true, 8, '2020-10-09 14:43:03.859541+00');
INSERT INTO public.moped_project_roles (project_role_id, project_role_name, active_role, role_order, date_added) VALUES (9, 'Implementation Support', true, 9, '2020-10-09 14:43:03.859543+00');
INSERT INTO public.moped_project_roles (project_role_id, project_role_name, active_role, role_order, date_added) VALUES (10, 'Field Engineer', true, 10, '2020-10-09 14:43:03.859545+00');
INSERT INTO public.moped_project_roles (project_role_id, project_role_name, active_role, role_order, date_added) VALUES (11, 'Project Sponsor', true, 11, '2020-10-09 14:43:03.859547+00');
INSERT INTO public.moped_project_roles (project_role_id, project_role_name, active_role, role_order, date_added) VALUES (12, 'Unknown Role', true, 100, '2020-10-09 14:43:03.859548+00');
INSERT INTO public.moped_project_roles (project_role_id, project_role_name, active_role, role_order, date_added) VALUES (2, 'Street Designer', true, 2, '2020-10-09 14:44:51.2889+00');
INSERT INTO public.moped_proj_personnel (project_id, user_id, role_id, date_added, notes, status_id) VALUES (1, 1, 1, '2020-12-04 16:53:02.752811+00', 'This is a note', 1);
SELECT pg_catalog.setval('public.moped_categories_category_id_seq', 8, true);
SELECT pg_catalog.setval('public.moped_users_user_id_seq', 3, true);
SELECT pg_catalog.setval('public.moped_components_component_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_entities_entity_id_seq', 1, true);
SELECT pg_catalog.setval('public.moped_financials_financials_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_fund_opp_funding_opportunity_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_fund_source_cat_funding_source_category_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_fund_sources_funding_source_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_groups_group_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_milestone_history_project_milestone_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_milestones_milestone_id_seq', 11, true);
SELECT pg_catalog.setval('public.moped_phase_history_project_milestone_id_seq', 13, true);
SELECT pg_catalog.setval('public.moped_phases_phase_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_proj_categories_proj_category_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_proj_communication_comm_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_proj_components_moped_proj_component_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_proj_dates_date_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_proj_entities_entity_list_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_proj_fund_opp_fund_opp_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_proj_fund_opp_proj_fund_opp_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_proj_fund_source_proj_fund_source_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_proj_groups_group_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_proj_location_location_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_proj_notes_project_note_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_proj_partners_proj_partner_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_proj_personnel_project_personnel_id_seq', 5, true);
SELECT pg_catalog.setval('public.moped_proj_timeline_timeline_id_seq', 2, true);
SELECT pg_catalog.setval('public.moped_project_project_id_simple_seq', 125, true);
SELECT pg_catalog.setval('public.moped_project_roles_project_role_id_seq', 13, true);
SELECT pg_catalog.setval('public.moped_status_history_project_status_history_id_seq', 6, true);
SELECT pg_catalog.setval('public.moped_status_notes_status_id_seq', 1, false);
SELECT pg_catalog.setval('public.moped_status_status_id_seq', 4, true);
SELECT pg_catalog.setval('public.moped_workgroup_workgroup_id_seq', 1, true);
