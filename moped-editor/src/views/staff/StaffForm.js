import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatApiErrors, useUserApi } from "./helpers";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { WORKGROUPS_QUERY } from "../../queries/workgroups";

import { useQuery } from "@apollo/client";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Grid,
  InputLabel,
  TextField,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  formSelect: {
    minWidth: 195,
  },
  formButton: {
    margin: theme.spacing(1),
  },
  formDeleteButton: {
    margin: theme.spacing(1),
    backgroundColor: "red",
    color: "white",
  },
  hiddenTextField: {
    display: "none",
  },
}));

export const initialFormValues = {
  first_name: "",
  last_name: "",
  title: "",
  email: "",
  password: "",
  workgroup: "",
  workgroup_id: "",
  roles: "moped-viewer",
  status_id: "1",
};

const roles = [
  { value: "moped-viewer", name: "Viewer" },
  { value: "moped-editor", name: "Editor" },
  { value: "moped-admin", name: "Admin" },
];

const statuses = [
  { value: "1", name: "Active" },
  { value: "0", name: "Inactive" },
];

// Pass editFormData to conditionally validate if adding or editing
const staffValidationSchema = isNewUser =>
  yup.object().shape({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    title: yup.string().required(),
    workgroup: yup.string().required(),
    workgroup_id: yup.string().required(),
    email: yup.string().required(),
    password: yup.mixed().when({
      // If we are editing a user, password is optional
      is: () => isNewUser,
      then: yup.string().required(),
      otherwise: yup.string(),
    }),
    roles: yup.string().required(),
    status_id: yup.string().required(),
  });

const fieldParsers = {
  status_id: id => parseInt(id),
  workgroup_id: id => parseInt(id),
  roles: role => [role],
};

/**
 * Generates a StaffForm Component
 * @param {Object} editFormData - The form data
 * @param {string} userCognitoId - The User's Cognito UUID (if available)
 * @returns {JSX.Element}
 * @constructor
 */
const StaffForm = ({ editFormData = null, userCognitoId }) => {
  const classes = useStyles();
  let navigate = useNavigate();
  const isNewUser = editFormData === null;

  /**
   * Make use of the useUserApi to retrieve the requestApi function and
   * api request loading state and errors from the api.
   */
  const {
    loading: userApiLoading,
    requestApi,
    error: apiErrors,
    setError,
    setLoading,
  } = useUserApi();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApiErrorOpen, setIsApiErrorOpen] = useState(false);

  const {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    formState,
    reset,
  } = useForm({
    defaultValues: editFormData || initialFormValues,
    resolver: yupResolver(staffValidationSchema(isNewUser)),
  });

  const { isSubmitting, dirtyFields } = formState;

  /**
   * Controls the onSubmit data event
   * @param {Object} data - The data being submitted
   */
  const onSubmit = data => {
    // Parse values with fns from config
    Object.entries(fieldParsers).forEach(([fieldName, parser]) => {
      const originalValue = data[fieldName];
      const parsedValue = parser(originalValue);

      data[fieldName] = parsedValue;
    });

    // POST or PUT request to User Management API
    const method = isNewUser ? "post" : "put";
    const path = isNewUser ? "/users/" : "/users/" + userCognitoId;

    // If editing and password is not updated, remove it
    if (!dirtyFields?.password) {
      delete data.password;
    }

    // Navigate to user table on successful add/edit
    const callback = () => navigate("/moped/staff");

    requestApi({
      method,
      path,
      payload: data,
      callback,
    });
  };

  const {
    loading: workgroupLoading,
    error: workgroupError,
    data: workgroups,
  } = useQuery(WORKGROUPS_QUERY);

  /**
   * Updates the workgroup field state
   * @param {Object} e - Event
   * @returns {string} - The workgroup name
   */
  const updateWorkgroupFields = e => {
    const workgroupId = e.nativeEvent.target.dataset.id;
    const workgroupName = e.target.value;

    // When workgroup field updates, set corresponding workgroup_id value
    setValue("workgroup_id", workgroupId);

    // React Hook Form expects the custom onChange action to return workgroup field value
    return workgroupName;
  };

  /**
   * Handler for Delete Confirm button
   */
  const handleDeleteConfirm = () => {
    const requestPath = "/users/" + userCognitoId;
    const deleteCallback = () => setIsDeleteModalOpen(false);

    requestApi({
      method: "delete",
      path: requestPath,
      callback: deleteCallback,
    });
  };

  /**
   * Clears the API errors window and closes it
   */
  const clearApiErrors = () => {
    setIsApiErrorOpen(false);
    setError(null);
    setLoading(false);
  };

  // If there are any api errors, and the modal is closed, open it
  if (apiErrors && !isApiErrorOpen) setIsApiErrorOpen(true);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="first_name"
            id="first-name"
            label="First Name"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            error={!!errors.first_name || !!apiErrors?.first_name}
            helperText={
              errors.first_name?.message ||
              formatApiErrors(apiErrors?.first_name)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="last_name"
            id="last-name"
            label="Last Name"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            error={!!errors.last_name || !!apiErrors?.last_name}
            helperText={
              errors.last_name?.message || formatApiErrors(apiErrors?.last_name)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="title"
            id="title"
            label="Title"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            error={!!errors.title || !!apiErrors?.title}
            helperText={
              errors.title?.message || formatApiErrors(apiErrors?.title)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="email"
            id="email"
            label="Email"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            error={!!errors.email || !!apiErrors?.email}
            helperText={
              errors.email?.message || formatApiErrors(apiErrors?.email)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="password"
            id="password"
            label="Password"
            type="password"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
            error={!!errors.password || !!apiErrors?.password}
            helperText={
              errors.password?.message || formatApiErrors(apiErrors?.password)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {workgroupLoading ? (
            <CircularProgress />
          ) : (
            <FormControl variant="outlined" className={classes.formSelect}>
              <InputLabel id="workgroup-label">Workgroup</InputLabel>
              <Controller
                render={({ onChange, ref, value }) => (
                  <Select
                    id="workgroup"
                    labelId="workgroup-label"
                    label="Workgroup"
                    onChange={e => onChange(updateWorkgroupFields(e))}
                    inputRef={ref}
                    value={value}
                  >
                    {workgroups.moped_workgroup.map(workgroup => (
                      <MenuItem
                        key={workgroup.workgroup_id}
                        value={workgroup.workgroup_name}
                        data-id={workgroup.workgroup_id}
                      >
                        {workgroup.workgroup_name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name={"workgroup"}
                control={control}
              />
              {workgroupError && (
                <FormHelperText>
                  Workgroups failed to load. Please refresh.
                </FormHelperText>
              )}
              {errors.workgroup && (
                <FormHelperText>{errors.workgroup?.message}</FormHelperText>
              )}
            </FormControl>
          )}
        </Grid>
        {/* This hidden field is populated with workgroup_id field by updateWorkgroupFields() */}
        <TextField
          id="workgroup-id"
          name="workgroup_id"
          inputRef={register}
          className={classes.hiddenTextField}
        />
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <FormLabel id="roles-label">Role</FormLabel>
            <Controller
              as={
                <RadioGroup aria-label="roles" name="roles">
                  {roles.map(role => (
                    <FormControlLabel
                      key={role.value}
                      value={role.value}
                      control={<Radio />}
                      label={role.name}
                    />
                  ))}
                </RadioGroup>
              }
              name={"roles"}
              control={control}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <FormLabel id="statuses-label">Status</FormLabel>
            <Controller
              as={
                <RadioGroup aria-label="statuses" name="status_id">
                  {statuses.map(status => (
                    <FormControlLabel
                      key={status.value}
                      value={status.value}
                      control={<Radio />}
                      label={status.name}
                    />
                  ))}
                </RadioGroup>
              }
              name={"status_id"}
              control={control}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          {!apiErrors && (userApiLoading || isSubmitting) ? (
            <CircularProgress />
          ) : (
            <>
              <Button
                className={classes.formButton}
                disabled={isSubmitting}
                type="submit"
                color="primary"
                variant="contained"
              >
                Save
              </Button>
              {!editFormData && (
                <Button
                  className={classes.formButton}
                  color="secondary"
                  variant="contained"
                  onClick={() => reset(initialFormValues)}
                >
                  Reset
                </Button>
              )}
              {editFormData && (
                <Button
                  className={classes.formDeleteButton}
                  color="secondary"
                  variant="contained"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  Delete User
                </Button>
              )}
            </>
          )}
          <Dialog
            open={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete this user?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure that you want to delete this user?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                color="primary"
                autoFocus
              >
                No
              </Button>
              {userApiLoading ? (
                <CircularProgress />
              ) : (
                <Button onClick={handleDeleteConfirm} color="primary">
                  Yes
                </Button>
              )}
            </DialogActions>
          </Dialog>
          <Dialog
            open={!!apiErrors}
            onClose={clearApiErrors}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Error While Creating User"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {(apiErrors?.error?.other ?? []).join(", ")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={clearApiErrors} color="primary" autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </form>
  );
};

export default StaffForm;
