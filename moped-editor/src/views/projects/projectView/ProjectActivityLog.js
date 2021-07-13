import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useActivityLogLookupTables } from "../../../utils/activityLogHelpers";
import {
  getCreationLabel,
  getOperationName,
  getChangeIcon,
  getRecordTypeLabel,
  getHumanReadableField,
  getMappedValue,
  isFieldMapped,
  ProjectActivityLogGenericDescriptions,
} from "./ProjectActivityLogTableMaps";

import ProjectActivityLogDialog from "./ProjectActivityLogDialog";

import {
  Avatar,
  Box,
  Button,
  CardContent,
  CircularProgress,
  Grid,
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

import { PROJECT_ACTIVITY_LOG } from "../../../queries/project";
import { ACCOUNT_USER_PROFILE_GET } from "../../../queries/account";
import CDNAvatar from "../../../components/CDN/Avatar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Alert } from "@material-ui/lab";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  tableCell: {
    verticalAlign: "top",
  },
  tableChangeItem: {
    padding: "0 .5rem",
  },
  avatarSmall: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  avatarName: {
    margin: "0.3rem 0 0 .5rem",
  },
}));

const ProjectActivityLog = () => {
  const { projectId } = useParams();
  const classes = useStyles();
  const userList = {};
  const unknownUserNameValue = "Unknown User";

  const {
    getLookups,
    lookupLoading,
    lookupError,
    lookupMap,
  } = useActivityLogLookupTables();

  const { loading, error, data } = useQuery(PROJECT_ACTIVITY_LOG, {
    variables: { projectId },
    onCompleted: data => getLookups(data, "activity_log_lookup_tables"),
  });

  // const { loadingProfile, errorProfile, dataProfile } = useQuery(ACCOUNT_USER_PROFILE_GET, {
  //   variables: {
  //     userId: config.env.APP_ENVIRONMENT === "local" ? 1 : getDatabaseId(user),
  //   },
  // });

  const [activityId, setActivityId] = useState(null);

  /**
   * Closes the details dialog
   */
  const handleDetailsClose = () => {
    setActivityId(null);
  };

  /**
   * Opens the details dialog
   * @param {string} activityId - The activity uuid
   */
  const handleDetailsOpen = activityId => {
    setActivityId(activityId);
  };

  if (loading || lookupLoading) return <CircularProgress />;

  /**
   * Formats the iso date into human-readable locale date.
   * @param {string} date - The ISO date as a string
   * @return {string}
   */
  const formatDate = date =>
    new Date(date).toLocaleDateString("en-US", { timeZone: "UTC" });

  /**
   * Retrieve the user's full name or return an "N/A"
   * @param {object} moped_user - The user object as provided by hasura
   * @return {string}
   */
  const getUserFullName = moped_user => {
    const firstName = moped_user?.first_name ?? "";
    const lastName = moped_user?.last_name ?? "";
    if (firstName.length === 0 && firstName.length === 0)
      return unknownUserNameValue;
    return `${firstName} ${lastName}`;
  };

  /**
   * Safely returns the initials from a full name
   * @param {object} moped_user - The full name of the user
   * @return {string}
   */
  const getInitials = moped_user => {
    // Get any names if available
    const name = getUserFullName(moped_user).trim();

    // If no names are available, return null to force the generic humanoid avatar
    if (name.length === 0 || name === unknownUserNameValue) return null;

    // Else, extract initials
    return name
      .replace(/[^A-Za-z0-9À-ÿ ]/gi, "")
      .replace(/ +/gi, " ")
      .split(/ /)
      .reduce((acc, item) => acc + item[0], "")
      .concat(name.substr(1))
      .concat(name)
      .substr(0, 2)
      .toUpperCase();
  };

  const getUserAvatar = moped_user => {
    console.log("moped user");
    console.log(moped_user)
    return "/moped/static/images/avatars/userAvatar.jpg"
  }

  /**
   * Attempt to get the number of items we retrieved
   * @return {number}
   */
  const getTotalItems = () => {
    return data?.moped_activity_log?.length ?? 0;
  };

  /**
   * Returns True if the field should be a generic type (i.e., maps, objects)
   * @param {string} field - The field name (column name)
   * @return {boolean} - True if the field is contained in the ProjectActivityLogGenericDescriptions object
   */
  const isFieldGeneric = field =>
    field in ProjectActivityLogGenericDescriptions;

  /**
   * Makes sure the creation of the project always comes first
   * @param {Array} eventList - The data object as provided by apollo
   * @return {Array}
   */
  const reorderCreationEvent = eventList => {
    // Clone eventList array so it can be mutated
    let outputList = [...eventList];

    outputList.forEach(event => {
      // If this is the creation of a project
      if (
        event.record_type === "moped_project" &&
        event.operation_type === "INSERT"
      ) {
        // Remove that object from the array and add it back on at the end
        outputList.splice(outputList.indexOf(event), 1);
        outputList.push(event);
      }
    });

    return outputList;
  };

  if (data) {
    data["moped_users"].forEach(user => {
      userList[`${user.user_id}`] = `${user.first_name} ${user.last_name}`;
    });
  }

  return (
    <ApolloErrorHandler error={error || lookupError}>
      <CardContent>
        <h2 style={{ padding: "0rem 0 2rem 0" }}>Activity feed</h2>
        {getTotalItems() === 0 ? (
          <Alert severity="info">
            There aren't any items for this project.
          </Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    <b>Date</b>
                  </TableCell>
                  <TableCell align="left">
                    <b>User</b>
                  </TableCell>
                  <TableCell align="left">
                    <b>Action</b>
                  </TableCell>
                  <TableCell align="left">
                    <b>Change</b>
                  </TableCell>
                  <TableCell align="left"> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reorderCreationEvent(data["moped_activity_log"]).map(
                  change => (
                    <TableRow key={change.activity_id}>
                      <TableCell
                        align="left"
                        component="th"
                        scope="row"
                        width="5%"
                        className={classes.tableCell}
                      >
                        {formatDate(change.created_at)}
                      </TableCell>
                      <TableCell
                        align="left"
                        width="15%"
                        className={classes.tableCell}
                      >
                        <Box display="flex" p={0}>
                          <Box p={0}>
                            <Avatar
                              alt={getInitials(change?.moped_user)}
                              src={getUserAvatar(change?.moped_user)}
                              className={classes.avatarSmall}
                            >
                              {getInitials(change?.moped_user)}
                            </Avatar>
                          </Box>
                          <Box
                            p={0}
                            flexGrow={1}
                            className={classes.avatarName}
                          >
                            {getUserFullName(change?.moped_user)}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="left"
                        width="5%"
                        className={classes.tableCell}
                      >
                        <b>
                          {getOperationName(
                            change.operation_type,
                            change.record_type
                          )}
                        </b>
                      </TableCell>
                      <TableCell
                        align="left"
                        width="70%"
                        className={classes.tableCell}
                      >
                        <Box display="flex" p={0}>
                          <Box p={0}>
                            <Icon>
                              {getChangeIcon(
                                change.operation_type,
                                change.record_type
                              )}
                            </Icon>
                          </Box>
                          <Box p={0} flexGrow={1}>
                            <Grid continer>
                              {Array.isArray(change.description) &&
                                change.description.length === 0 && (
                                  <Grid
                                    item
                                    className={classes.tableChangeItem}
                                  >
                                    <b>{getCreationLabel(change, userList)}</b>
                                  </Grid>
                                )}
                              {change.description.map(changeItem => {
                                return (
                                  <Grid
                                    item
                                    className={classes.tableChangeItem}
                                  >
                                    {isFieldGeneric(changeItem.field) ? (
                                      <b>
                                        {
                                          ProjectActivityLogGenericDescriptions[
                                            changeItem.field
                                          ]?.label
                                        }
                                      </b>
                                    ) : (
                                      <>
                                        <b>
                                          {getRecordTypeLabel(
                                            change.record_type
                                          )}{" "}
                                          {getHumanReadableField(
                                            change.record_type,
                                            changeItem.field
                                          )}
                                        </b>{" "}
                                        from{" "}
                                        <b>
                                          &quot;
                                          {isFieldMapped(
                                            change.record_type,
                                            changeItem.field
                                          )
                                            ? getMappedValue(
                                                change.record_type,
                                                changeItem.field,
                                                String(changeItem.old)
                                              )
                                            : lookupMap?.[change.record_type]?.[
                                                changeItem.field
                                              ]?.[changeItem.old] ||
                                              String(changeItem.old)}
                                          &quot;
                                        </b>{" "}
                                        to{" "}
                                        <b>
                                          &quot;
                                          {isFieldMapped(
                                            change.record_type,
                                            changeItem.field
                                          )
                                            ? getMappedValue(
                                                change.record_type,
                                                changeItem.field,
                                                String(changeItem.new)
                                              )
                                            : lookupMap?.[change.record_type]?.[
                                                changeItem.field
                                              ]?.[changeItem.new] ||
                                              String(changeItem.new)}
                                          &quot;
                                        </b>
                                      </>
                                    )}
                                  </Grid>
                                );
                              })}
                            </Grid>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell width="5%">
                        <Button
                          onClick={() => handleDetailsOpen(change.activity_id)}
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {!!activityId && (
          <ProjectActivityLogDialog
            activity_id={activityId}
            handleClose={handleDetailsClose}
          />
        )}
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectActivityLog;
