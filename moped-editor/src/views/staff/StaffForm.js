import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserApi } from "./helpers";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { gql, useQuery } from "@apollo/react-hooks";
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

const WORKGROUPS_QUERY = gql`
  query GetWorkgroups {
    moped_workgroup {
      workgroup_id
      workgroup_name
    }
  }
`;

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
const staffValidationSchema = editFormData =>
  yup.object().shape({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    title: yup.string().required(),
    workgroup: yup.string().required(),
    workgroup_id: yup.string().required(),
    email: yup.string().required(),
    password: yup.mixed().when({
      // If we are editing a user, password is optional
      is: () => editFormData === null,
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

const StaffForm = ({ editFormData = null, userCognitoId }) => {
  const classes = useStyles();
  let navigate = useNavigate();
  const [userApiLoading, requestApi] = useUserApi();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    resolver: yupResolver(staffValidationSchema(editFormData)),
  });

  const { isSubmitting, dirtyFields } = formState;

  const onSubmit = data => {
    // Parse values with fns from config
    Object.entries(fieldParsers).forEach(([fieldName, parser]) => {
      const originalValue = data[fieldName];
      const parsedValue = parser(originalValue);

      data[fieldName] = parsedValue;
    });

    // POST or PUT request to User Management API
    const method = editFormData === null ? "post" : "put";
    const path = editFormData === null ? "/users/" : "/users/" + userCognitoId;

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

  const updateWorkgroupFields = e => {
    const workgroupId = e.nativeEvent.target.dataset.id;
    const workgroupName = e.target.value;

    // When workgroup field updates, set corresponding workgroup_id value
    setValue("workgroup_id", workgroupId);

    // React Hook Form expects the custom onChange action to return workgroup field value
    return workgroupName;
  };

  const handleDeleteConfirm = () => {
    const requestPath = "/users/delete/" + userCognitoId;
    const deleteCallback = () => setIsDeleteModalOpen(false);

    requestApi({
      method: "delete",
      path: requestPath,
      callback: deleteCallback,
    });
  };

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
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
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
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
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
            error={!!errors.title}
            helperText={errors.title?.message}
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
            error={!!errors.email}
            helperText={errors.email?.message}
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
            error={!!errors.password}
            helperText={errors.password?.message}
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
          {userApiLoading || isSubmitting ? (
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
        </Grid>
      </Grid>
    </form>
  );
};

export default StaffForm;
