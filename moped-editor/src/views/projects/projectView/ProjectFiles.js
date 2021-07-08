import React, { useState } from "react";
import { useParams } from "react-router-dom";

import {
  Button,
  CardContent,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";

import makeStyles from "@material-ui/core/styles/makeStyles";
import typography from "../../../theme/typography";
import MaterialTable, { MTableEditRow, MTableAction } from "material-table";
import {
  AddCircle as AddCircleIcon,
  Clear as ClearIcon,
} from "@material-ui/icons";
import { useMutation, useQuery } from "@apollo/client";

import humanReadableFileSize from "../../../utils/humanReadableFileSize";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import FileUploadDialogSingle from "../../../components/FileUpload/FileUploadDialogSingle";
import {
  PROJECT_FILE_ATTACHMENTS,
  PROJECT_FILE_ATTACHMENTS_DELETE,
  PROJECT_FILE_ATTACHMENTS_UPDATE,
  PROJECT_FILE_ATTACHMENTS_CREATE,
} from "../../../queries/project";
import { getJwt, getDatabaseId, useUser } from "../../../auth/user";
import downloadFileAttachment from "../../../utils/downloadFileAttachment";

const useStyles = makeStyles(theme => ({
  title: {
    padding: "0rem 0 2rem 0",
  },
  uploadFileButton: {
    float: "right",
  },
  downloadLink: {
    cursor: "pointer",
  },
}));

/**
 * Renders a list of file attachments for a project
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const ProjectFiles = props => {
  const classes = useStyles();
  const { projectId } = useParams();
  const { user } = useUser();
  const token = getJwt(user);

  /**
   * @constant {boolean} dialogOpen - True to make the save dialog visible
   * @function setDialogOpen - Changes the state of the dialogOpen constant
   */
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * Handles the upload file button onClick behavior
   */
  const handleClickUploadFile = () => {
    setDialogOpen(true);
  };

  /**
   * Handles the cancel button onClick behavior
   */
  const handleClickCloseUploadFile = () => {
    setDialogOpen(false);
  };

  /**
   * Persists the file data into the database
   * @param {Object} fileDataBundle - The file bundle as provided by the FileUpload component
   */
  const handleClickSaveFile = fileDataBundle => {
    createProjectFileAttachment({
      variables: {
        object: {
          project_id: projectId,
          file_name: fileDataBundle?.name,
          file_description: fileDataBundle.description,
          file_key: fileDataBundle.key,
          file_size: fileDataBundle?.file?.fileSize ?? 0,
          created_by: getDatabaseId(user),
        },
      },
    })
      .then(() => {
        setDialogOpen(false);
      })
      .finally(() => {
        refetch();
      });
  };

  /**
   * List of files query
   */
  const { loading, error, data, refetch } = useQuery(PROJECT_FILE_ATTACHMENTS, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  /** addAction Ref - mutable ref object used to access add action button
   * imperatively.
   * @type {object} addActionRef
   * */
  const addActionRef = React.useRef();

  /**
   * Mutations
   */
  const [updateProjectFileAttachment] = useMutation(
    PROJECT_FILE_ATTACHMENTS_UPDATE
  );

  const [deleteProjectFileAttachment] = useMutation(
    PROJECT_FILE_ATTACHMENTS_DELETE
  );

  const [createProjectFileAttachment] = useMutation(
    PROJECT_FILE_ATTACHMENTS_CREATE
  );

  // If no data or loading show progress circle
  if (loading || !data) return <CircularProgress />;

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    {
      title: "Name",
      field: "file_name",
      render: record => (
        <Link
          className={classes.downloadLink}
          onClick={() => downloadFileAttachment(record?.file_key, token)}
        >
          {record?.file_name}
        </Link>
      ),
      editComponent: props => (
        <TextField
          id="file_name"
          name="file_name"
          value={props.value}
          onChange={e => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "Description",
      field: "file_description",
      render: record => <span>{record?.file_description}</span>,
      editComponent: props => (
        <TextField
          id="file_description"
          name="file_description"
          value={props?.value}
          onChange={e => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "Uploaded by",
      render: record => (
        <span>
          {record?.created_by
            ? record?.moped_user?.first_name +
              " " +
              record?.moped_user?.last_name
            : "N/A"}
        </span>
      ),
    },
    {
      title: "Date uploaded",
      customSort: (a, b) =>
        new Date(a?.create_date ?? 0) - new Date(b?.create_date ?? 0),
      render: record => (
        <span>
          {record?.create_date
            ? new Date(record.create_date).toLocaleString("en-US", {
                timeZone: "UTC",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      title: "File size",
      customSort: (a, b) => (a?.file_size ?? 0) - (b?.file_size ?? 0),
      render: record => (
        <span>{humanReadableFileSize(record?.file_size ?? 0)}</span>
      ),
    },
  ];

  return (
    <CardContent>
      <ApolloErrorHandler errors={error}>
        <MaterialTable
          columns={columns}
          data={data?.moped_project_files ?? null}
          title={
            <Typography variant="h2" color="primary">
              Files
            </Typography>
          }
          // Action component customized as described in this gh-issue:
          // https://github.com/mbrn/material-table/issues/2133
          components={{
            EditRow: props => (
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
            Action: props => {
              // If isn't the add action
              if (
                typeof props.action === typeof Function ||
                props.action.tooltip !== "Add"
              ) {
                return <MTableAction {...props} />;
              } else {
                return (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.uploadFileButton}
                    startIcon={<AddCircleIcon />}
                    ref={addActionRef}
                    onClick={handleClickUploadFile}
                  >
                    Add file
                  </Button>
                );
              }
            },
          }}
          icons={{ Delete: ClearIcon }}
          options={{
            ...(data.moped_project_files.length < 26 && {
              paging: false,
            }),
            search: false,
            rowStyle: { fontFamily: typography.fontFamily },
            actionsColumnIndex: -1,
          }}
          localization={{
            header: {
              actions: "",
            },
            body: {
              emptyDataSourceMessage: (
                <Typography variant="body1">No files to display</Typography>
              ),
            },
          }}
          editable={{
            onRowAdd: () => {
              handleClickUploadFile();
            },
            onRowUpdate: (newData, oldData) =>
              updateProjectFileAttachment({
                variables: {
                  fileId: newData.project_file_id,
                  fileName: newData.file_name,
                  fileDescription: newData.file_description,
                },
              }).then(() => {
                refetch();
              }),
            onRowDelete: oldData =>
              deleteProjectFileAttachment({
                variables: {
                  fileId: oldData.project_file_id,
                },
              }).then(() => {
                refetch();
              }),
          }}
        />
      </ApolloErrorHandler>
      <FileUploadDialogSingle
        title={"Upload Media"}
        dialogOpen={dialogOpen}
        handleClickCloseUploadFile={handleClickCloseUploadFile}
        handleClickSaveFile={handleClickSaveFile}
        projectId={projectId}
      />
    </CardContent>
  );
};

export default ProjectFiles;
