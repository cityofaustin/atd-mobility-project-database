import React from "react";
import {
  TextField,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  CircularProgress,
} from "@material-ui/core";
import { useQuery, gql } from "@apollo/client";

const DefineProjectForm = ({
  projectDetails,
  setProjectDetails,
  nameError,
  descriptionError,
}) => {
  const handleFieldChange = (value, name) => {
    const updatedProjectDetails = { ...projectDetails, [name]: value };

    setProjectDetails(updatedProjectDetails);
  };

  const STATUS_QUERY = gql`
    query Status {
      moped_status(
        order_by: { status_order: asc }
        where: { status_id: { _gt: 0 } }
      ) {
        status_name
      }
    }
  `;

  const FISCAL_QUERY = gql`
    query Fiscal {
      moped_city_fiscal_years(order_by: { fiscal_year_value: asc }) {
        fiscal_year_value
      }
    }
  `;

  const {
    loading: statusLoading,
    error: statusError,
    data: statuses,
  } = useQuery(STATUS_QUERY);

  const { loading: fiscalLoading, error: fiscalError, data: fiscal } = useQuery(
    FISCAL_QUERY
  );

  const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

  if (statusLoading) return <CircularProgress />;
  if (statusError) return `Error! ${statusError.message}`;

  if (fiscalLoading) return <CircularProgress />;
  if (fiscalError) return `Error! ${fiscalError.message}`;

  return (
    <form style={{ padding: 25 }}>
      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={6}>
          <TextField
            required
            label="Project name"
            name="project_name"
            variant="standard"
            type="text"
            fullWidth
            value={projectDetails.project_name}
            error={nameError}
            helperText="Required"
            InputLabelProps={{ required: false }}
            onChange={e => handleFieldChange(e.target.value, e.target.name)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={6}>
          <TextField
            required
            label="Description"
            name="project_description"
            multiline={true}
            variant="standard"
            type="text"
            fullWidth
            value={projectDetails.project_description}
            error={descriptionError}
            helperText="Required"
            InputLabelProps={{ required: false }}
            onChange={e => handleFieldChange(e.target.value, e.target.name)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={3}>
          <TextField
            name="start_date"
            label="Start date"
            type="date"
            variant="standard"
            value={projectDetails.start_date}
            onChange={e => handleFieldChange(e.target.value, e.target.name)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={3}>
          <InputLabel>Fiscal year</InputLabel>
          <Select
            name="fiscal_year"
            style={{ width: 150, paddingLeft: 10 }}
            value={projectDetails.fiscal_year}
            onChange={e => handleFieldChange(e.target.value, e.target.name)}
          >
            {fiscal.moped_city_fiscal_years.map(fiscal => (
              <MenuItem
                key={fiscal.fiscal_year_value}
                value={fiscal.fiscal_year_value}
              >
                {fiscal.fiscal_year_value}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={3}>
          <InputLabel>Current status</InputLabel>
          <Select
            name="current_status"
            style={{ width: 150, paddingLeft: 10 }}
            value={projectDetails.current_status}
            onChange={e => handleFieldChange(e.target.value, e.target.name)}
          >
            {statuses.moped_status.map(status => (
              <MenuItem key={status.status_name} value={status.status_name}>
                {capitalize(status.status_name)}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={3}>
          <InputLabel>Capital funding?</InputLabel>
          <Switch
            type="checkbox"
            checked={projectDetails.capitally_funded}
            name="capitally_funded"
            inputProps={{ "aria-label": "secondary checkbox" }}
            onChange={e => handleFieldChange(e.target.checked, e.target.name)}
          />
        </Grid>
        {projectDetails.capitally_funded && (
          <Grid item xs={3}>
            <TextField
              label="eCAPRIS subproject ID"
              name="ecapris_subproject_id"
              variant="standard"
              type="text"
              value={projectDetails.ecapris_subproject_id}
              onChange={e => handleFieldChange(e.target.value, e.target.name)}
            />
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default DefineProjectForm;
