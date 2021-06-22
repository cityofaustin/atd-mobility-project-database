import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createBrowserHistory } from "history";
import { useLocation } from "react-router-dom";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Icon,
  Paper,
  Tab,
  Tabs,
  useTheme,
} from "@material-ui/core";
import GridTableFilters from "./GridTableFilters";
import GridTableSearchBar from "./GridTableSearchBar";
import GridTableExport from "./GridTableExport";
import TabPanel from "../../views/projects/projectView/TabPanel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useLazyQuery } from "@apollo/client";
import moment from "moment";
import { get } from "lodash";

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  downloadButtonGrid: {
    padding: "1rem 1rem 0 1rem",
  },
  downloadCsvButton: {
    height: "2.5rem",
  },
  tabStyle: {
    margin: ".5rem",
  },
}));

const history = createBrowserHistory();

/**
 * Renders a table search component with a search bar and search filters
 * @param {GQLAbstract} query - The GQLAbstract object as provided by the parent component
 * @param {Object} searchState - The current state/state-modifier bundle for search
 * @param {Object} filterState - The current state/state-modifier bundle for filters
 * @param {JSX.Element} children - Any components to be rendered above the search bar
 * @return {JSX.Element}
 * @constructor
 */
const GridTableSearch = ({
  query,
  searchState,
  filterState,
  children,
  filterQuery,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const queryPath = useLocation().pathname;

  /**
   * Controls what tab is being displayed
   * @type {boolean} tabValue
   * @function setTabValue - Sets the state of tabValue
   * @default if filter exists in url, 1. Otherwise 0.
   */
  const [tabValue, setTabValue] = React.useState(
    Array.from(filterQuery).length
  );

  /**
   * When True, the dialog is open.
   * @type {boolean} dialogOpen
   * @function setDialogOpen - Sets the state of dialogOpen
   * @default false
   */
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * When True, the download happens.
   * @type {boolean} downloading
   * @function setDownloading - Sets the state of downloading
   * @default false
   */
  const [downloading, setDownloading] = useState(false);

  /**
   * Instantiates getExport, loading and data variables
   * @function getExport - It is called to load the data
   * @property {boolean} loading - True whenever the data is being loaded
   * @property {object} data - The data as retrieved from query (if available)
   */
  let [getExport, { called, stopPolling, loading, data }] = useLazyQuery(
    query.queryCSV(Object.keys(query.config.export).join(" \n")),
    // Temporary fix for https://github.com/apollographql/react-apollo/issues/3361
    query.config.useQuery
  );

  /**
   * Generates a sanitized string for CSV
   * @param {*} value - Any value
   * @return {string}
   */
  const dataSanitizeValueExport = value => {
    return typeof value !== "number" ? `"${value}"` : String(value);
  };

  /**
   * Retrieves a list of headers for the data
   * @param {Array} data - The data payload
   * @return {string[]}
   */
  const dataGetHeaders = data => {
    return Array.isArray(data)
      ? Object.keys(data[0]).filter(key => key !== "__typename")
      : [];
  };

  /**
   * Converts a single data entry into a CSV line
   * @param {string[]} headers - The list of headers that determines the order
   * @param {Object} data - The data as provided by Hasura
   * @return {string}
   */
  const dataToCSV = (headers, data) => {
    return (
      headers.join(",") +
      "\n" +
      data
        .map(item => {
          return headers
            .map(key => dataSanitizeValueExport(item[key]))
            .join(",");
        })
        .join("\n")
    );
  };

  /**
   * Downloads the contents of fileContents into a file
   * @param {string} fileContents
   */
  const downloadFile = fileContents => {
    const exportFileName = query.table + moment(Date.now()).format();
    const blob = new Blob([fileContents], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      link.style.visibility = "hidden";
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", exportFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    }
  };

  /**
   * Builds a record entry given a specific configuration and filters
   * @param {object} record - The record to build
   * @return {object}
   */
  const buildRecordEntry = record => {
    // Allocate an empty object
    const entry = {};
    // For each column in the export configuration
    Object.keys(query.config.export).forEach(column => {
      // Extract the label, filter, and path
      const { label, filter, path } = query.config.export[column];
      // Determine the new column name, if available.
      const newColumnName = label ? label : column;
      // If it's a nested graphql expression, use lodash get and
      // the path to get to the value, otherwise, assign the value.
      const value = query.isNestedKey(column)
        ? get(record, path)
        : record[column];
      // If there is a filter, use it. Assign the value to the new column name.
      entry[newColumnName] = filter ? filter(value) : value;
    });
    // Return new object
    return entry;
  };

  /**
   * Returns an array of objects (each object is a row and each key of that object is a column in the export file)
   * @param {array} data - Data returned from DB with nested data structures
   * @returns {array}
   */
  const formatExportData = data => {
    if (data) {
      return data.map(record => {
        return buildRecordEntry(record);
      });
    }
    return [];
  };

  /**
   * Handles export button (to open the dialog)
   */
  const handleExportButtonClick = () => {
    setDialogOpen(true);
  };

  /**
   * Handles the closing of the dialog
   */
  const handleDialogClose = () => {
    if (called) stopPolling();
    setDialogOpen(false);
  };

  /**
   * Clears the filters when switching to simple search
   */
  const handleSwitchToSearch = () => {
    filterState.setFilterParameters({});
    filterQuery.delete("filter");
    history.replace(`${queryPath}?`);
  };

  /**
   * Clears the simple search when switching to filters
   */
  const handleSwitchToAdvancedSearch = () => {
    searchState.setSearchParameters({
      value: "",
      column: "",
    });
  };

  /**
   * Handles the click on a tab to switch between tabs
   * @param {Object} event - The tab being clicked event
   * @param {number} newTabValue - The clicked tab value
   */
  const handleTabChange = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

  /**
   * Update the export whenever limit or selectall change
   */
  useEffect(
    () => {
      if (dialogOpen && !downloading) {
        query.limit = 0;
        getExport();
        setDownloading(true);
      }

      if (dialogOpen && downloading && data && !loading) {
        const formattedData = formatExportData(data[query.table]);
        const headers = dataGetHeaders(formattedData);
        const csvString = dataToCSV(headers, formattedData);
        setTimeout(() => {
          // Update the state
          setDialogOpen(false);
          downloadFile(csvString);
        }, 1500);
      }
    },
    // eslint-disable-next-line
    [dialogOpen, downloading, loading, query.limit, getExport]
  );

  return (
    <div>
      <GridTableExport query={query} />
      {children}

      <Box mt={3}>
        <Paper>
          <Grid container lg={12}>
            <Grid item xs={12} sm={6} md={8} lg={10} xl={10}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                aria-label="Search Data Table"
              >
                <Tab
                  className={classes.tabStyle}
                  onClick={handleSwitchToSearch}
                  label={
                    <div>
                      <Icon style={{ verticalAlign: "middle" }}>search</Icon>{" "}
                      Search{" "}
                    </div>
                  }
                />
                <Tab
                  className={classes.tabStyle}
                  onClick={handleSwitchToAdvancedSearch}
                  label={
                    <div>
                      <Icon style={{ verticalAlign: "middle" }}>rule</Icon>{" "}
                      Advanced Search{" "}
                    </div>
                  }
                />
              </Tabs>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={2}
              xl={2}
              className={classes.downloadButtonGrid}
            >
              {query.config.showExport && (
                <Button
                  className={classes.downloadCsvButton}
                  onClick={handleExportButtonClick}
                  startIcon={<Icon>save</Icon>}
                  variant="outlined"
                  color="primary"
                  fullWidth
                >
                  Download
                </Button>
              )}
            </Grid>
          </Grid>

          <TabPanel value={tabValue} index={0} dir={theme.direction}>
            <GridTableSearchBar query={query} searchState={searchState} />
          </TabPanel>
          <TabPanel value={tabValue} index={1} dir={theme.direction}>
            <GridTableFilters
              query={query}
              filterState={filterState}
              filterQuery={filterQuery}
              history={history}
            />
          </TabPanel>
        </Paper>
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title"> </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={2} lg={2}>
              <CircularProgress />
            </Grid>
            <Grid item xs={10} lg={10}>
              <DialogContentText>
                Preparing download, please wait.
              </DialogContentText>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

GridTableSearch.propTypes = {
  className: PropTypes.string,
};

export default GridTableSearch;
