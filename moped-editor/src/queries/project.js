import { gql } from "@apollo/client";

export const PROJECT_NAME = gql`
  query ProjectName($projectId: Int) {
    moped_project(where: { project_id: { _eq: $projectId } }) {
      project_name
    }
  }
`;

export const ADD_PROJECT = gql`
  mutation MyMutation(
    $project_name: String! = ""
    $project_description: String! = ""
    $current_phase: String! = ""
    $current_status: String! = ""
    $eCapris_id: String! = ""
    $fiscal_year: String! = ""
    $start_date: date = ""
    $capitally_funded: Boolean! = false
    $project_priority: String! = ""
    $project_extent_ids: jsonb = {}
    $project_extent_geojson: jsonb = {}
  ) {
    insert_moped_project(
      objects: {
        project_name: $project_name
        project_description: $project_description
        current_phase: $current_phase
        current_status: $current_status
        eCapris_id: $eCapris_id
        fiscal_year: $fiscal_year
        start_date: $start_date
        capitally_funded: $capitally_funded
        project_priority: $project_priority
        project_extent_ids: $project_extent_ids
        project_extent_geojson: $project_extent_geojson
      }
    ) {
      affected_rows
      returning {
        project_id
        project_name
        project_description
        project_priority
        current_phase
        current_status
        eCapris_id
        fiscal_year
        capitally_funded
        start_date
        project_extent_ids
        project_extent_geojson
      }
    }
  }
`;

export const SUMMARY_QUERY = gql`
  query ProjectSummary($projectId: Int) {
    moped_project(where: { project_id: { _eq: $projectId } }) {
      project_id
      project_name
      project_description
      start_date
      current_phase
      current_status
      capitally_funded
      eCapris_id
      fiscal_year
      project_priority
      project_extent_ids
      project_extent_geojson
    }
  }
`;

export const TEAM_QUERY = gql`
  query TeamSummary($projectId: Int) {
    moped_proj_personnel(
      where: { project_id: { _eq: $projectId }, status_id: { _eq: 1 } }
    ) {
      user_id
      role_id
      notes
      status_id
      project_id
      project_personnel_id
      date_added
      added_by
    }
    moped_workgroup {
      workgroup_id
      workgroup_name
    }
    moped_project_roles {
      project_role_id
      project_role_name
    }
    moped_users(
      order_by: { last_name: asc }
      where: { status_id: { _eq: 1 } }
    ) {
      first_name
      last_name
      workgroup_id
      user_id
    }
  }
`;

export const ADD_PROJECT_PERSONNEL = gql`
  mutation AddProjectPersonnel(
    $objects: [moped_proj_personnel_insert_input!]!
  ) {
    insert_moped_proj_personnel(objects: $objects) {
      affected_rows
    }
  }
`;

export const UPDATE_PROJECT_PERSONNEL = gql`
  mutation UpdateProjectPersonnel(
    $user_id: Int
    $notes: String
    $project_id: Int
    $status_id: Int
    $project_personnel_id: Int!
    $date_added: timestamptz
    $added_by: Int
    $role_id: Int
  ) {
    update_moped_proj_personnel_by_pk(
      pk_columns: { project_personnel_id: $project_personnel_id }
      _set: {
        user_id: $user_id
        notes: $notes
        project_id: $project_id
        status_id: $status_id
        project_personnel_id: $project_personnel_id
        date_added: $date_added
        added_by: $added_by
        role_id: $role_id
      }
    ) {
      user_id
      role_id
      notes
    }
  }
`;

export const TIMELINE_QUERY = gql`
  query TeamTimeline($projectId: Int) {
    moped_phases {
      phase_id
      phase_name
    }
    moped_proj_phases(
      where: { project_id: { _eq: $projectId } }
      order_by: { phase_start: desc }
    ) {
      phase_name
      project_phase_id
      is_current_phase
      project_id
      phase_start
      phase_end
    }
  }
`;

export const UPDATE_PROJECT_PHASES_MUTATION = gql`
  mutation ProjectPhasesMutation(
    $is_current_phase: Boolean
    $phase_start: date = null
    $phase_end: date = null
    $project_phase_id: Int!
    $phase_name: String!
  ) {
    update_moped_proj_phases_by_pk(
      pk_columns: { project_phase_id: $project_phase_id }
      _set: {
        is_current_phase: $is_current_phase
        phase_start: $phase_start
        phase_end: $phase_end
        phase_name: $phase_name
      }
    ) {
      project_id
      project_phase_id
      phase_name
      phase_start
      phase_end
      is_current_phase
    }
  }
`;

export const DELETE_PROJECT_PHASE = gql`
  mutation DeleteProjectPhase($project_phase_id: Int!) {
    delete_moped_proj_phases_by_pk(project_phase_id: $project_phase_id) {
      project_phase_id
    }
  }
`;

export const ADD_PROJECT_PHASE = gql`
  mutation AddProjectPhase($objects: [moped_proj_phases_insert_input!]!) {
    insert_moped_proj_phases(objects: $objects) {
      returning {
        phase_name
        phase_start
        phase_end
        project_phase_id
        is_current_phase
        project_id
        completion_percentage
        completed
      }
    }
  }
`;

export const UPDATE_PROJECT_EXTENT = gql`
  mutation UpdateProjectExtent(
    $projectId: Int
    $editLayerIds: jsonb
    $editFeatureCollection: jsonb
  ) {
    update_moped_project(
      where: { project_id: { _eq: $projectId } }
      _set: {
        project_extent_geojson: $editFeatureCollection
        project_extent_ids: $editLayerIds
      }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_ACTIVITY_LOG = gql`
  query getMopedProjectChanges($projectId: Int!) {
    moped_activity_log(
      where: { record_project_id: { _eq: $projectId } }
      order_by: { created_at: desc }
    ) {
      activity_id
      created_at
      record_project_id
      record_type
      description
      operation_type
      record_data
      moped_user {
        first_name
        last_name
        user_id
      }
    }
    moped_users(where: { status_id: { _eq: 1 } }) {
      first_name
      last_name
      user_id
      email
    }
    activity_log_lookup_tables: moped_activity_log(
      where: { record_project_id: { _eq: $projectId } }
      distinct_on: record_type
    ) {
      record_type
    }
  }
`;

export const PROJECT_ACTIVITY_LOG_DETAILS = gql`
  query getMopedProjectChanges($activityId: uuid!) {
    moped_activity_log(where: { activity_id: { _eq: $activityId } }) {
      activity_id
      created_at
      record_project_id
      record_type
      record_data
      description
      operation_type
      moped_user {
        first_name
        last_name
        user_id
      }
    }
    activity_log_lookup_tables: moped_activity_log(
      where: { activity_id: { _eq: $activityId } }
      distinct_on: record_type
    ) {
      record_type
    }
  }
`;

export const PROJECT_FILE_ATTACHMENTS = gql`
  query MopedProjectFiles($projectId: Int!) {
    moped_project_files(
      where: { project_id: { _eq: $projectId }, is_retired: { _eq: false } }
    ) {
      project_file_id
      project_id
      file_key
      file_name
      file_description
      file_size
      file_metadata
      file_description
      create_date
      created_by
      moped_user {
        user_id
        first_name
        last_name
      }
    }
  }
`;

export const PROJECT_FILE_ATTACHMENTS_UPDATE = gql`
  mutation UpdateProjectFileAttachment(
    $fileId: Int!
    $fileName: String!
    $fileDescription: String!
  ) {
    update_moped_project_files(
      where: { project_file_id: { _eq: $fileId } }
      _set: { file_name: $fileName, file_description: $fileDescription }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_FILE_ATTACHMENTS_DELETE = gql`
  mutation DeleteProjectFileAttachment($fileId: Int!) {
    update_moped_project_files(
      where: { project_file_id: { _eq: $fileId } }
      _set: { is_retired: true }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_FILE_ATTACHMENTS_CREATE = gql`
  mutation insert_single_article($object: moped_project_files_insert_input!) {
    insert_moped_project_files(objects: [$object]) {
      affected_rows
    }
  }
`;

export const PROJECT_ARCHIVE = gql`
  mutation ArchiveMopedProject($projectId: Int!) {
    update_moped_project(
      where: { project_id: { _eq: $projectId } }
      _set: { is_retired: true }
    ) {
      affected_rows
    }
  }
`;
