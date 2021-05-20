import React from "react";

// Material
import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import MaterialTable, { MTableAction } from "material-table";

// Query
import {
  TIMELINE_QUERY,
  UPDATE_PROJECT_PHASES_MUTATION,
  DELETE_PROJECT_PHASE,
  ADD_PROJECT_PHASE,
} from "../../../queries/project";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

/**
 * DateFieldEditComponent - renders a Date type Calendar select
 * @param {object} props - Values passed through Material Table `editComponent`
 * @param {string} name - Field name
 * @param {string} label - Display label
 * @return {JSX.Element}
 * @constructor
 */
const DateFieldEditComponent = (props, name, label) => (
  <TextField
    name={name}
    label={label}
    type="date"
    variant="standard"
    value={props.value}
    onChange={e => props.onChange(e.target.value)}
    InputLabelProps={{
      shrink: true,
    }}
  />
);

/**
 * ToggleEditComponent - renders a toggle for True/False edit fields
 * @param {object} props - Values passed through Material Table `editComponent`
 * @param {string} name - Field name
 * @return {JSX.Element}
 * @constructor
 */
const ToggleEditComponent = (props, name) => (
  <Grid component="label" container alignItems="center" spacing={1}>
    <Grid item>
      <Switch
        checked={props.value}
        onChange={e => props.onChange(!props.value)}
        color="primary"
        name={name}
        inputProps={{ "aria-label": "primary checkbox" }}
      />
    </Grid>
  </Grid>
);

/**
 * ProjectTimeline Component - renders the view displayed when the "Timeline"
 * tab is active
 * @return {JSX.Element}
 * @constructor
 */
const ProjectTimeline = ({ refetch: refetchSummary }) => {
  /** Params Hook
   * @type {integer} projectId
   * */
  const { projectId } = useParams();

  /** addAction Ref - mutable ref object used to access add action button
   * imperatively.
   * @type {object} addActionRef
   * */
  const addActionRef = React.useRef();

  /**
   * Queries Hook
   * @type {boolean} - loading state
   * @type {object} - details and messages when there is a query error
   * @type {object} - data returned from Hasura
   * @function refetch - Provides a manual callback to update the Apollo cache
   * */
  const { loading, error, data, refetch } = useQuery(TIMELINE_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  // Mutations
  const [updateProjectPhase] = useMutation(UPDATE_PROJECT_PHASES_MUTATION);
  const [deleteProjectPhase] = useMutation(DELETE_PROJECT_PHASE);
  const [addProjectPhase] = useMutation(ADD_PROJECT_PHASE);

  // If the query is loading or data object is undefined,
  // stop here and just render the spinner.
  if (loading || !data) return <CircularProgress />;

  /**
   * Phase table lookup object formatted into the shape that <MaterialTable>
   * expects.
   * Ex: { construction: "Construction", hold: "Hold", ...}
   */
  const phaseNameLookup = data.moped_phases.reduce(
    (obj, item) =>
      Object.assign(obj, {
        [item.phase_name]:
          item.phase_name.charAt(0).toUpperCase() + item.phase_name.slice(1),
      }),
    {}
  );

  const updateExistingPhases = phaseObject => {
    // If new or updated phase has a current phase of true,
    // set current phase of any other true phases to false
    // to ensure there is only one active phase
    if (phaseObject.is_current_phase) {
      data.moped_proj_phases.forEach(phase => {
        if (
          phase.is_current_phase &&
          phase.project_phase_id !== phaseObject.project_phase_id
        ) {
          phase.is_current_phase = false;
          // Execute update mutation, returns promise
          return updateProjectPhase({
            variables: phase,
          }).then(() => {
            // Refetch data
            refetch();
            refetchSummary();
          });
        }
      });
    }
  };

  /**
   * Phase table lookup object formatted into the shape that <MaterialTable>
   * expects.
   * Ex: { construction: "Construction", hold: "Hold", ...}
   */
  const subphaseNameLookup = data.moped_subphases.reduce(
    (obj, item) =>
      Object.assign(obj, {
        [item.subphase_name.toLowerCase()]:
          item.subphase_name.charAt(0).toUpperCase() +
          item.subphase_name.slice(1),
      }),
    {}
  );

  /**
   * Generates a filtered number of sub-phase lookup elements
   * @param {Array} allowedSubphaseIds - An array of integers containing the allowed subphase ids
   * @param {Object} moped_subphases - The data object containing all sub-phase data
   */
  const generateSubphaseLookup = (allowedSubphaseIds, moped_subphases) =>
    moped_subphases
      .filter(item => allowedSubphaseIds.includes(item.subphase_id))
      .reduce(
        (obj, item) =>
          Object.assign(obj, {
            [item.subphase_name.toLowerCase()]:
              item.subphase_name.charAt(0).toUpperCase() +
              item.subphase_name.slice(1),
          }),
        {}
      );

  /**
   * Prevents the line from being saved on enter key
   * @param {object} e - Event Object
   */
  const handleKeyEvent = e => {
    if (e.key === "Enter" || e.key === " ") {
      e.stopPropagation();
    }
  };

  /**
   * DateFieldEditComponent - renders a Date type Calendar select
   * @param {object} props - Values passed through Material Table `editComponent`
   * @param {string} name - Field name
   * @param {string} label - Display label
   * @return {JSX.Element}
   * @constructor
   */
  const DateFieldEditComponent = (props, name, label) => (
    <TextField
      name={name}
      label={label}
      type="date"
      variant="standard"
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
      onKeyDown={e => handleKeyEvent(e)}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );

  /**
   * ToggleEditComponent - renders a toggle for True/False edit fields
   * @param {object} props - Values passed through Material Table `editComponent`
   * @param {string} name - Field name
   * @return {JSX.Element}
   * @constructor
   */
  const ToggleEditComponent = (props, name) => (
    <Grid component="label" container alignItems="center" spacing={1}>
      <Grid item>
        <Switch
          checked={props.value}
          onChange={e => props.onChange(!props.value)}
          color="primary"
          name={name}
          inputProps={{ "aria-label": "primary checkbox" }}
          onKeyDown={e => handleKeyEvent(e)}
        />
      </Grid>
    </Grid>
  );

  /**
   * DropDownSelectComponent - Renders a drop down menu for MaterialTable
   * @param {object} props - Values passed through Material Table `editComponent`
   * @param {string} name - Field name
   * @return {JSX.Element}
   * @constructor
   */
  const DropDownSelectComponent = props => {
    // If the component name is phase_name, then assume phaseNameLookup values
    // Otherwise assume null,
    let lookupValues = props.name === "phase_name" ? phaseNameLookup : null;

    // If lookup values is null, then it is a sub-phase list we need to generate
    if (lookupValues === null) {
      // First retrieve the sub-phase id's from moped_phases for that specific row
      const allowedSubphaseIds = props.data.moped_phases
        .filter(
          item =>
            // filter out any phases that are not the one we selected
            (item?.phase_name ?? "").toLowerCase() ===
            // props.rowData.phase_name is the row's phase name
            // which could be null if nothing is selected
            (props.rowData?.phase_name ?? "").toLowerCase()
        )
        .reduce(
          // Then using reduce, aggregate the sub-phase ids from whatever array is left
          (accumulator, item) =>
            (accumulator = [...accumulator, ...(item?.subphases ?? [])]),
          []
        );

      // If we are left with a zero-length array, hide the drop-down.
      if (allowedSubphaseIds.length === 0) {
        return null;
      }

      // We have a usable array of sub-phase ids, generate lookup values,
      lookupValues = generateSubphaseLookup(
        allowedSubphaseIds,
        props.data.moped_subphases
      );
    }

    // Proceed normally and generate the drop-down
    return (
      <Select id={props.name} value={props.value}>
        {Object.keys(lookupValues).map(key => {
          return (
            <MenuItem
              onChange={() => props.onChange(key)}
              onClick={() => props.onChange(key)}
              onKeyDown={e => handleKeyEvent(e)}
              value={key}
            >
              {lookupValues[key]}
            </MenuItem>
          );
        })}
      </Select>
    );
  };

  /**
   * Column configuration for <MaterialTable>
   */
  const columns = [
    { title: "Phase Name", field: "phase_name", lookup: phaseNameLookup },
    {
      title: "Active?",
      field: "is_current_phase",
      lookup: { true: "Yes", false: "No" },
      editComponent: props => (
        <ToggleEditComponent {...props} name="is_current_phase" />
      ),
    },
    {
      title: "Start Date",
      field: "phase_start",
      editComponent: props => (
        <DateFieldEditComponent
          {...props}
          name="phase_start"
          label="Start Date"
        />
      ),
    },
    {
      title: "End Date",
      field: "phase_end",
      editComponent: props => (
        <DateFieldEditComponent {...props} name="phase_end" label="End Date" />
      ),
    },
  ];

  return (
    <ApolloErrorHandler error={error}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div style={{ maxWidth: "100%" }}>
              <MaterialTable
                columns={columns}
                data={data.moped_proj_phases}
                title="Project Phases"
                // Action component customized as described in this gh-issue:
                // https://github.com/mbrn/material-table/issues/2133
                components={{
                  Action: props => {
                    // If isn't the add action
                    if (
                      typeof props.action === typeof Function ||
                      props.action.tooltip !== "Add"
                    ) {
                      return <MTableAction {...props} />;
                    } else {
                      return (
                        <div
                          ref={addActionRef}
                          onClick={props.action.onClick}
                        />
                      );
                    }
                  },
                }}
                editable={{
                  onRowAdd: newData => {
                    const newPhaseObject = Object.assign(
                      {
                        project_id: projectId,
                        completion_percentage: 0,
                        completed: false,
                        status_id: 1,
                      },
                      newData
                    );

                    updateExistingPhases(newPhaseObject);

                    // Execute insert mutation, returns promise
                    return addProjectPhase({
                      variables: {
                        objects: [newPhaseObject],
                      },
                    }).then(() => {
                      // Refetch data
                      refetch();
                      refetchSummary();
                    });
                  },
                  onRowUpdate: (newData, oldData) => {
                    const updatedPhaseObject = {
                      ...oldData,
                    };

                    // Array of differences between new and old data
                    let differences = Object.keys(oldData).filter(
                      key => oldData[key] !== newData[key]
                    );

                    // Loop through the differences and assign newData values.
                    // If one of the Date fields is blanked out, coerce empty
                    // string to null.
                    differences.forEach(diff => {
                      let shouldCoerceEmptyStringToNull =
                        newData[diff] === "" &&
                        (diff === "phase_start" || diff === "phase_end");

                      if (shouldCoerceEmptyStringToNull) {
                        updatedPhaseObject[diff] = null;
                      } else {
                        updatedPhaseObject[diff] = newData[diff];
                      }
                    });

                    // Remove extraneous fields given by MaterialTable that
                    // Hasura doesn't need
                    delete updatedPhaseObject.tableData;
                    delete updatedPhaseObject.project_id;
                    delete updatedPhaseObject.__typename;

                    updateExistingPhases(updatedPhaseObject);

                    // Execute update mutation, returns promise
                    return updateProjectPhase({
                      variables: updatedPhaseObject,
                    }).then(() => {
                      // Refetch data
                      refetch();
                      refetchSummary();
                    });
                  },
                  onRowDelete: oldData => {
                    // Execute mutation to set current phase of phase to be deleted to false
                    // to ensure summary table stays up to date
                    oldData.is_current_phase = false;
                    return updateProjectPhase({
                      variables: oldData,
                    }).then(() => {
                      // Execute delete mutation, returns promise
                      return deleteProjectPhase({
                        variables: {
                          project_phase_id: oldData.project_phase_id,
                        },
                      }).then(() => {
                        // Refetch data
                        refetch();
                        refetchSummary();
                      });
                    });
                  },
                }}
              />
            </div>
            <Box pt={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddBoxIcon />}
                onClick={() => addActionRef.current.click()}
              >
                Add phase
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectTimeline;
