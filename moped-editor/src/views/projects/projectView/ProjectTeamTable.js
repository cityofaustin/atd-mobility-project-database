import React from "react";
import { useQuery, useMutation } from "@apollo/client";

// Material
import {
  Chip,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { Clear as ClearIcon } from "@material-ui/icons";
import MaterialTable, { MTableEditRow } from "material-table";
import Autocomplete from "@material-ui/lab/Autocomplete";

import typography from "../../../theme/typography";

// Error Handler
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

import { TEAM_QUERY, UPSERT_PROJECT_PERSONNEL } from "../../../queries/project";

import ProjectTeamRoleMultiselect from "./ProjectTeamRoleMultiselect";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(() => ({
  roleChip: {
    margin: ".25rem",
  },
}));

const ProjectTeamTable = ({
  personnelState,
  setPersonnelState,
  projectId = null,
}) => {
  const isNewProject = projectId === null;
  const classes = useStyles();

  const { loading, error, data, refetch } = useQuery(TEAM_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  const [upsertProjectPersonnel] = useMutation(UPSERT_PROJECT_PERSONNEL);

  if (loading || !data) return <CircularProgress />;

  // Get data from the team query payload
  const users = data.moped_users;
  const personnel = {};

  // For each personnel entry...
  data.moped_proj_personnel.map(item => {
    // If the item does not exist in the aggregated object
    if (!personnel.hasOwnProperty(item.user_id)) {
      // instantiate a new object & populate
      personnel[`${item.user_id}`] = {};
      personnel[`${item.user_id}`].user_id = item.user_id;
      personnel[`${item.user_id}`].role_id = [item.role_id];
      personnel[`${item.user_id}`].notes = item.notes;
    } else {
      // Aggregate role_ids, and notes.
      personnel[`${item.user_id}`].role_id.push(item.role_id);
      personnel[`${item.user_id}`].notes = (
        (personnel[`${item.user_id}`].notes ?? "") +
        " " +
        item.notes
      ).trim();
    }

    return null; // No need to return anything...
  });

  // Create some objects for lookups
  const workgroups = data.moped_workgroup.reduce(
    (acc, workgroup) => ({
      ...acc,
      [workgroup.workgroup_id]: workgroup.workgroup_name,
    }),
    {}
  );
  const roles = data.moped_project_roles.reduce(
    (acc, role) => ({
      ...acc,
      [role.project_role_id]: role.project_role_name,
    }),
    {}
  );

  // Options for Autocomplete form elements
  const userIds = users.map(user => user.user_id);

  /**
   * Get a user object from the users array
   * @param {number} id - User id from the moped project personnel row
   * @return {object} Object containing user data
   */
  const getUserById = id => users.find(user => user.user_id === id);

  /**
   * Get personnel name from their user ID
   * @param {number} id - User id from the moped project personnel row
   * @return {string} Full name of user
   */
  const getPersonnelName = id => {
    const user = getUserById(id);
    return `${user.first_name} ${user.last_name}`;
  };

  /**
   * Get personnel workgroup from their user ID
   * @param {number} id - User id from the moped project personnel row
   * @return {string} Workgroup name of the user
   */
  const getPersonnelWorkgroup = id => {
    const user = getUserById(id);
    return workgroups[user.workgroup_id];
  };

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Name",
      field: "user_id",
      render: personnel => getPersonnelName(personnel.user_id),
      validate: rowData => !!rowData.user_id,
      editComponent: props => (
        <Autocomplete
          id="user_id"
          name="user_id"
          options={userIds}
          getOptionLabel={option => getPersonnelName(option)}
          getOptionSelected={(option, value) => option === value}
          value={props.value}
          onChange={(event, value) => props.onChange(value)}
          renderInput={params => <TextField {...params} />}
        />
      ),
    },
    {
      title: "Workgroup",
      render: personnel => (
        <Typography>{getPersonnelWorkgroup(personnel.user_id)}</Typography>
      ),
    },
    {
      title: "Role",
      field: "role_id",
      render: personnel => {
        return personnel.role_id.map(chipRoleId => (
          <Chip
            className={classes.roleChip}
            variant="outlined"
            label={roles[chipRoleId]}
          />
        ));
      },
      validate: rowData => Array.isArray(rowData) && rowData.length() > 0,
      editComponent: props => (
        <ProjectTeamRoleMultiselect
          id="role_id"
          name="role_id"
          initialValue={props.rowData.role_id}
          value={props.value}
          onChange={props.onChange}
          roles={roles}
        />
      ),
    },
    {
      title: "Notes",
      field: "notes",
      editComponent: props => (
        <TextField
          id="notes"
          name="notes"
          multiline
          inputProps={{ maxLength: 125 }}
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      ),
    },
  ];

  /**
   * Data handlers for editable actions based on isNewProject boolean <MaterialTable>
   */
  const isNewProjectActions = {
    true: {
      add: newData => {
        let newDataCopy = {...newData};
        // Aggregate into a unique set if there is stuff already there
        const newPersonnelState = personnelState.map(item => {
          if (item.user_id === newData.user_id) {
            const output = {
              user_id: item.user_id,
              role_id: [...new Set([...item.role_id, ...newData.role_id])],
              notes: (item?.notes ?? "") + " " + (newData?.notes ?? ""),
            };
            newDataCopy = null;
            return output;
          } else {
            return item;
          }
        });

        setPersonnelState(
          [...newPersonnelState, newDataCopy].filter(item => item !== null)
        );
      },
      update: (newData, oldData) => {
        // Remove the existing user and overwrite
        const newState = personnelState.filter(
          item => item.user_id !== newData.user_id
        );
        setPersonnelState([...newState, newData]);
      },
      delete: oldData => {
        const newState = personnelState.filter(
          item => item.user_id !== oldData.user_id
        );
        setPersonnelState([...newState]);
      },
    },
    false: {
      add: newData => {
        // Our new data is unique, we will attempt upsert since
        // we may have existing data in our table
        const personnelData = newData.role_id.map((roleId, index) => {
          return {
            project_id: Number.parseInt(projectId),
            user_id: newData.user_id,
            role_id: roleId,
            status_id: 1,
            notes: index === 0 ? newData.notes : "",
          };
        });

        // Upsert as usual
        upsertProjectPersonnel({
          variables: {
            objects: personnelData,
          },
        });
      },
      update: (newData, oldData) => {
        // Gather a list of ids to be "removed"
        const removedIds = oldData.role_id.filter(
          n => !newData.role_id.includes(n)
        );

        // Removed ids means they are not present in new data,
        // So it can be safely combined in a single list with new data
        // If the role has been removed, we will mark it as status_id: 0
        const updatedPersonnelData = [...newData.role_id, ...removedIds].map(
          (roleId, index) => {
            return {
              project_id: Number.parseInt(projectId),
              user_id: newData.user_id,
              role_id: roleId,
              status_id: removedIds.includes(roleId) ? 0 : 1,
              notes: index === 0 ? newData.notes : "",
            };
          }
        );

        // Upsert as usual
        upsertProjectPersonnel({
          variables: {
            objects: updatedPersonnelData,
          },
        });
      },
      delete: oldData => {
        // We will soft delete by marking as "status_id"
        const updatedPersonnelData = oldData.role_id.map((roleId, index) => {
          return {
            project_id: Number.parseInt(projectId),
            user_id: oldData.user_id,
            role_id: roleId,
            status_id: 0,
            notes: index === 0 ? oldData.notes : "",
          };
        });

        // Upsert as usual
        upsertProjectPersonnel({
          variables: {
            objects: updatedPersonnelData,
          },
        });
      },
    },
  };

  return (
    <ApolloErrorHandler errors={error}>
      <MaterialTable
        columns={columns}
        components={{
          EditRow: (props, rowData) => (
            <MTableEditRow
              {...props}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  // Bypass default MaterialTable behavior of submitting the entire form when a user hits enter
                  // See https://github.com/mbrn/material-table/pull/2008#issuecomment-662529834
                }
              }}
            />
          ),
        }}
        data={
          isNewProject
            ? personnelState
            : Object.keys(personnel).map(item => {
                return personnel[item];
              })
        }
        title="Project team"
        options={{
          search: false,
          rowStyle: { fontFamily: typography.fontFamily },
          actionsColumnIndex: -1
        }}
        icons={{ Delete: ClearIcon }}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                isNewProjectActions[isNewProject].add(newData);

                setTimeout(() => refetch(), 501);
                resolve();
              }, 500);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                isNewProjectActions[isNewProject].update(newData, oldData);

                setTimeout(() => refetch(), 501);
                resolve();
              }, 500);
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                isNewProjectActions[isNewProject].delete(oldData);

                setTimeout(() => refetch(), 501);
                resolve();
              }, 500);
            }),
        }}
      />
    </ApolloErrorHandler>
  );
};

export default ProjectTeamTable;
