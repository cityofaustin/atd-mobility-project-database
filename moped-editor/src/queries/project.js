import { gql } from "@apollo/client";

export const ADD_PROJECT = gql`
  mutation AddProject(
    $object: moped_project_insert_input!
  ) {
    insert_moped_project_one(
      object: $object
    ) {
      project_id
      project_name
      project_description
      project_priority
      current_phase
      current_status
      ecapris_subproject_id
      fiscal_year
      capitally_funded
      start_date
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
      ecapris_subproject_id
      fiscal_year
      project_priority
      moped_proj_features(where: {status_id: {_eq: 1}}) {
        feature_id
        project_id
        location
      }
    }
    moped_phases {
      phase_id
      phase_name
    }
    moped_proj_phases(
      where: {
        project_id: { _eq: $projectId }
        is_current_phase: { _eq: true }
      }
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
      moped_user {
        first_name
        last_name
        workgroup_id
        user_id
      }
    }
    moped_workgroup {
      workgroup_id
      workgroup_name
    }
    moped_project_roles(order_by: {role_order: asc}, where: {project_role_id: {_gt: 0}}) {
      project_role_id
      project_role_name
      project_role_description
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

export const UPSERT_PROJECT_PERSONNEL = gql`
  mutation UpsertProjectPersonnel(
    $objects: [moped_proj_personnel_insert_input!]!
  ) {
    insert_moped_proj_personnel(
      objects: $objects,
      on_conflict: {
        constraint: moped_proj_personnel_project_id_user_id_role_id_key,
        update_columns: [
          project_id,
          user_id,
          role_id
          status_id,
          notes,
        ]
      }
    ) {
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
    moped_phases(where: { phase_id: {_gt: 0} }) {
      phase_id
      phase_name
      subphases
    }
    moped_subphases(where: { subphase_id: {_gt: 0} }, order_by: { subphase_order: asc }) {
      subphase_id
      subphase_name
    }
    moped_proj_phases(
      where: { project_id: { _eq: $projectId }, status_id: {_eq: 1} }
      order_by: { phase_start: desc }
    ) {
      phase_name
      project_phase_id
      is_current_phase
      project_id
      phase_start
      phase_end
      subphase_name
      subphase_id
    }
    moped_milestones(where: { milestone_id: {_gt: 0} }) {
      milestone_id
      milestone_name
    }
    moped_proj_milestones(
      where: { project_id: { _eq: $projectId }, status_id: {_eq: 1} }
      order_by: { milestone_end: desc }
    ) {
      milestone_name
      milestone_description
      milestone_estimate
      milestone_end
      completed
      project_milestone_id
      project_id
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
    $subphase_id: Int = 0,
    $subphase_name: String = null,
  ) {
    update_moped_proj_phases_by_pk(
      pk_columns: { project_phase_id: $project_phase_id }
      _set: {
        is_current_phase: $is_current_phase
        phase_start: $phase_start
        phase_end: $phase_end
        phase_name: $phase_name
        subphase_id: $subphase_id
        subphase_name: $subphase_name
      }
    ) {
      project_id
      project_phase_id
      phase_name
      phase_start
      phase_end
      subphase_id
      subphase_name
      is_current_phase
    }
  }
`;

export const UPDATE_PROJECT_MILESTONES_MUTATION = gql`
  mutation ProjectMilestonesMutation(
    $milestone_description: String
    $completed: Boolean
    $milestone_estimate: date = null
    $milestone_end: date = null
    $project_milestone_id: Int!
    $milestone_name: String!
  ) {
    update_moped_proj_milestones_by_pk(
      pk_columns: { project_milestone_id: $project_milestone_id }
      _set: {
        milestone_description: $milestone_description
        completed: $completed
        milestone_estimate: $milestone_estimate
        milestone_end: $milestone_end
        milestone_name: $milestone_name
      }
    ) {
      project_id
      project_milestone_id
      milestone_name
      milestone_estimate
      milestone_end
      completed
      milestone_description
    }
  }
`;

export const DELETE_PROJECT_PHASE = gql`
    mutation DeleteProjectPhase($project_phase_id: Int!) {
        update_moped_proj_phases(_set: {status_id: 0}, where: {project_phase_id: {_eq: $project_phase_id}}) {
            affected_rows
        }
    }
`;

export const DELETE_PROJECT_MILESTONE = gql`
    mutation DeleteProjectMilestone($project_milestone_id: Int!) {
        update_moped_proj_milestones(_set: {status_id: 0}, where: {project_milestone_id: {_eq: $project_milestone_id}}) {
            affected_rows
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
        status_id
      }
    }
  }
`;

export const ADD_PROJECT_MILESTONE = gql`
  mutation AddProjectMilestone($objects: [moped_proj_milestones_insert_input!]!) {
    insert_moped_proj_milestones(objects: $objects) {
      returning {
        milestone_name
        milestone_description
        milestone_estimate
        milestone_end
        completed
        project_milestone_id
        project_id
        status_id
      }
    }
  }
`;

export const UPSERT_PROJECT_EXTENT = gql`
  mutation UpsertProjectExtent(
    $upserts: [moped_proj_features_insert_input!]!
  ) {
    insert_moped_proj_features(
      objects: $upserts
      on_conflict: {
        constraint: moped_proj_features_pkey
        update_columns: status_id
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
    moped_users(where:{
      status_id:{_eq: 1}
    }) {
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
      where: {
        project_id: {_eq: $projectId},
        is_retired: {_eq: false}
      }
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
    $fileId: Int!,
    $fileName: String!,
    $fileDescription: String!
  ) {
    update_moped_project_files(
      where: {
        project_file_id: {
          _eq: $fileId
        }
      },
      _set: {
        file_name: $fileName,
        file_description: $fileDescription
      }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_FILE_ATTACHMENTS_DELETE = gql`
  mutation DeleteProjectFileAttachment(
    $fileId: Int!,
  ) {
    update_moped_project_files(
      where: {
        project_file_id: {
          _eq: $fileId
        }
      },
      _set: {
        is_retired: true,
      }
    ) {
      affected_rows
    }
  }
`;

export const PROJECT_FILE_ATTACHMENTS_CREATE = gql`
  mutation insert_single_article($object: moped_project_files_insert_input! ) {
    insert_moped_project_files(objects: [$object]) {
      affected_rows
    }
  }
`;

export const PROJECT_ARCHIVE= gql`
  mutation ArchiveMopedProject($projectId: Int!) {
    update_moped_project(where: {project_id: {_eq: $projectId}}, _set: {is_retired: true}) {
      affected_rows
    }
  }
`

export const PROJECT_CLEAR_MAP_DATA_TEMPLATE =
    `mutation ClearProjectMapData($projectId: Int!) {
      update_moped_proj_features(
        where: { project_id: { _eq: $projectId } }
        _set: {
          status_id: 0
        }
      ) {
        affected_rows
      }
      insert_moped_proj_features(objects:[
        {
          project_id: $projectId,
          location: {
              id: "RANDOM_FEATURE_ID",
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-97.74280552637893, 30.26807489857954],
              },
              properties: {
                renderType: "Point",
                sourceLayer: "drawnByUser",
                PROJECT_EXTENT_ID: "RANDOM_FEATURE_ID",
              },
            },
          status_id: 1
        }
      ]) {
        affected_rows
      }
    }
`;
