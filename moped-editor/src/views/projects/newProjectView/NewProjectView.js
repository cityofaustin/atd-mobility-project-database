import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Container,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import DefineProjectForm from "./DefineProjectForm";
import NewProjectTeam from "./NewProjectTeam";
import NewProjectMap from "./NewProjectMap";
import Page from "src/components/Page";
import { useMutation } from "@apollo/client";
import { ADD_PROJECT } from "../../../queries/project";
import { filterObjectByKeys } from "../../../utils/materialTableHelpers";
import { countFeatures, mapErrors, mapConfig } from "../../../utils/mapHelpers";

import ProjectSaveButton from "./ProjectSaveButton";

/**
 * Styles
 */
const useStyles = makeStyles(theme => ({
  cardWrapper: {
    marginTop: theme.spacing(3),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginLeft: theme.spacing(1),
  },
}));

/**
 * New Project View
 * @return {JSX.Element}
 * @constructor
 */
const NewProjectView = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newProjectId, setNewProjectId] = useState(null);

  // Redirect handlers
  const navigate = useNavigate();

  /**
   * Whenever we have a new project id, we can then set success
   * and trigger the redirect.
   */
  useEffect(() => {
    if (!!newProjectId) {
      window.setTimeout(() => {
        setSuccess(true);
      }, 1500);
    }
  }, [newProjectId]);

  useEffect(() => {
    if (!!newProjectId && success) {
      window.setTimeout(() => {
        navigate("/moped/projects/" + newProjectId);
      }, 800);
    }
  }, [success, newProjectId, navigate]);

  const [activeStep, setActiveStep] = useState(0);
  const [projectDetails, setProjectDetails] = useState({
    fiscal_year: "",
    current_phase: "",
    project_description: "",
    project_name: "",
    start_date: moment().format("YYYY-MM-DD"),
    current_status: "",
    capitally_funded: false,
    ecapris_subproject_id: null,
  });
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const [personnel, setPersonnel] = useState([]);
  const [featureCollection, setFeatureCollection] = useState({
    type: "FeatureCollection",
    features: [],
  });

  const [areNoFeaturesSelected, setAreNoFeaturesSelected] = useState(false);

  // Reset areNoFeaturesSelected once a feature is selected to remove error message
  useEffect(() => {
    if (
      countFeatures(featureCollection) >= mapConfig.minimumFeaturesInProject
    ) {
      setAreNoFeaturesSelected(false);
    }
  }, [featureCollection]);

  const getSteps = () => {
    return [
      { label: "Define project" },
      { label: "Assign team" },
      {
        label: "Map project",
        error: mapErrors.minimumLocations,
        isError: areNoFeaturesSelected,
      },
    ];
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <DefineProjectForm
            projectDetails={projectDetails}
            setProjectDetails={setProjectDetails}
            nameError={nameError}
            descriptionError={descriptionError}
          />
        );
      case 1:
        return (
          <NewProjectTeam personnel={personnel} setPersonnel={setPersonnel} />
        );
      case 2:
        return (
          <NewProjectMap
            featureCollection={featureCollection}
            setFeatureCollection={setFeatureCollection}
          />
        );
      default:
        return "Unknown step";
    }
  };
  const steps = getSteps();

  const handleNext = () => {
    let nameError = projectDetails.project_name.length === 0;
    let descriptionError = projectDetails.project_description.length === 0;
    let canContinue = false;

    if (!nameError && !descriptionError) {
      switch (activeStep) {
        case 0:
          canContinue = true;
          break;
        case 1:
          canContinue = true;
          break;
        case 2:
          canContinue = handleSubmit();
          break;
        default:
          return "not a valid step";
      }
    }
    if (canContinue) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }

    setNameError(nameError);
    setDescriptionError(descriptionError);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
      switch (activeStep) {
        case 1:
          break;
        case 2:
          break;
        default:
          return "not a valid step";
      }
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const [addProject] = useMutation(ADD_PROJECT);

  const timer = React.useRef();

  React.useEffect(() => {
    const currentTimer = timer.current;

    return () => {
      clearTimeout(currentTimer);
    };
  }, []);

  const handleSubmit = () => {
    if (countFeatures(featureCollection) < mapConfig.minimumFeaturesInProject) {
      setAreNoFeaturesSelected(true);
      return;
    } else {
      setAreNoFeaturesSelected(false);
    }

    // Change the initial state...
    setLoading(true);

    // A variable array of objects
    let cleanedPersonnel = [];

    // If personnel are added to the project, handle roles and remove unneeded data
    personnel
      // We need to flatten (reverse the nesting) for role_ids
      .forEach(item => {
        // For every personnel, iterate through role_ids
        item.role_id.forEach((role_id, index) => {
          cleanedPersonnel.push({
            role_id: role_id,
            user_id: item.user_id,
            status_id: 1,
            notes: index === 0 ? item?.notes ?? null : null,
          });
        });
      });

    cleanedPersonnel = cleanedPersonnel.map(row => ({
      ...filterObjectByKeys(row, ["tableData"]),
    }));

    const projectFeatures = featureCollection.features.map(feature => ({
      location: feature,
      status_id: 1,
    }));

    addProject({
      variables: {
        object: {
          ...projectDetails,
          moped_proj_features: { data: projectFeatures },
          moped_proj_personnel: { data: cleanedPersonnel },
        },
      },
    })
      .then(response => {
        const { project_id } = response.data.insert_moped_project_one;
        setNewProjectId(project_id);
      })
      .catch(err => {
        alert(err);
        setLoading(false);
        setSuccess(false);
      });
  };

  return (
    <>
      {
        <Page title="New project">
          <Container>
            <Card className={classes.cardWrapper}>
              <Box pt={2} pl={2}>
                <CardHeader title="New project" />
              </Box>
              <Divider />
              <CardContent>
                <Stepper activeStep={activeStep}>
                  {steps.map((step, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                      <Step key={step.label} {...stepProps}>
                        {step.isError ? (
                          <StepLabel error={true}>{step.error}</StepLabel>
                        ) : (
                          <StepLabel {...labelProps}>{step.label}</StepLabel>
                        )}
                      </Step>
                    );
                  })}
                </Stepper>
                <div>
                  {activeStep === steps.length ? (
                    <div>
                      <>
                        <Typography>Completed</Typography>
                        <Button onClick={handleReset}>Close</Button>
                      </>
                    </div>
                  ) : (
                    <div>
                      {getStepContent(activeStep)}
                      <Divider />
                      <Box pt={2} pl={2} className={classes.buttons}>
                        {activeStep > 0 && (
                          <Button
                            onClick={handleBack}
                            className={classes.button}
                          >
                            Back
                          </Button>
                        )}
                        {activeStep === steps.length - 1 ? (
                          <ProjectSaveButton
                            label={"Finish"}
                            loading={loading}
                            success={success}
                            handleButtonClick={handleSubmit}
                          />
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            className={classes.button}
                          >
                            Next
                          </Button>
                        )}
                      </Box>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Container>
        </Page>
      }
    </>
  );
};

export default NewProjectView;
