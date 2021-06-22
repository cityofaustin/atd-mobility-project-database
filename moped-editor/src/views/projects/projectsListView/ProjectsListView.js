import React from "react";

// Material
import { makeStyles } from "@material-ui/core";
import Page from "src/components/Page";

// Abstract
import { GQLAbstract } from "atd-kickstand";
import GridTable from "../../../components/GridTable/GridTable";
import { ProjectsListViewQueryConf } from "./ProjectsListViewQueryConf";

// Styles
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}));

/**
 * Load Query Configuration as a mutable object
 * @type {GQLAbstract}
 */
let projectsQuery = new GQLAbstract(ProjectsListViewQueryConf);

/**
 * Projects List View
 * @return {JSX.Element}
 * @constructor
 */
const ProjectsListView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Projects">
      <GridTable
        title={"Projects"}
        query={projectsQuery}
      />
    </Page>
  );
};

export default ProjectsListView;
