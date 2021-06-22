import { gql } from "@apollo/client";

export const COMMENTS_QUERY = gql`
  query GetProjectComments($projectId: Int!) {
    moped_proj_notes(
      where: { project_id: { _eq: $projectId }, status_id: { _eq: 1 } }
      order_by: { date_created: asc }
    ) {
      added_by
      project_note
      project_id
      date_created
      project_note_id
    }
  }
`;

export const ADD_PROJECT_COMMENT = gql`
  mutation AddProjectComment($objects: [moped_proj_notes_insert_input!]!) {
    insert_moped_proj_notes(objects: $objects) {
      returning {
        project_id
        project_note
      }
    }
  }
`;

export const UPDATE_PROJECT_COMMENT = gql`
  mutation UpdateProjectComment($projectId: Int!, $projectNoteId: Int!, $projectNote: String!) {
    update_moped_proj_notes(
      _set: { project_note: $projectNote }
      where: {
        project_id: { _eq: $projectId }
        project_note_id: { _eq: $projectNoteId }
      }
    ) {
      affected_rows
    }
  }
`;

export const DELETE_PROJECT_COMMENT = gql`
  mutation DeleteProjectComent($projectId: Int!, $projectNoteId: Int!) {
    update_moped_proj_notes(
      _set: {status_id: 0},
      where: {
        project_id: { _eq: $projectId }
        project_note_id: { _eq: $projectNoteId }
      }
    ) {
      affected_rows
    }
  }
`;