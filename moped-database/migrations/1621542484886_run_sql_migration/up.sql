CREATE OR REPLACE VIEW "public"."project_list_view" AS 
 SELECT mp.project_uuid,
    mp.project_id,
    mp.project_name,
    mp.project_description,
    mp.project_description_public,
    mp.ecapris_subproject_id,
    mp.project_importance,
    mp.project_order,
    mp.current_status,
    mp.timeline_id,
    mp.current_phase,
    mp.end_date,
    mp.project_length,
    mp.start_date,
    mp.fiscal_year,
    mp.capitally_funded,
    mp.project_priority,
    mp.date_added,
    mp.added_by,
    mp.is_retired,
    mp.milestone_id,
    mp.status_id,
    string_agg(concat(mu.first_name, ' ', mu.last_name, ':', mpr.project_role_name), ','::text) AS project_team_members,
    mp.updated_at
   FROM (((moped_project mp
     LEFT JOIN moped_proj_personnel mpp ON (((mp.project_id = mpp.project_id) AND (mpp.status_id = 1))))
     LEFT JOIN moped_users mu ON ((mpp.user_id = mu.user_id)))
     LEFT JOIN moped_project_roles mpr ON ((mpp.role_id = mpr.project_role_id)))
  GROUP BY mp.project_uuid, mp.project_id, mp.project_name, mp.project_description, mp.project_description_public, mp.ecapris_subproject_id, mp.project_importance, mp.project_order, mp.current_status, mp.timeline_id, mp.current_phase, mp.end_date, mp.project_length, mp.start_date, mp.fiscal_year, mp.capitally_funded, mp.project_priority, mp.date_added, mp.added_by, mp.is_retired, mp.milestone_id, mp.status_id, mp.updated_at;
