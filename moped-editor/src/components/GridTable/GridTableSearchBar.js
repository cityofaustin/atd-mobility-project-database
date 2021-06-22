import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  Button,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
  Icon,
  Grid,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";

/**
 * The styling for the search bar components
 * @type {Object}
 * @constant
 */
const useStyles = makeStyles(theme => ({
  root: {},
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  filterButton: {
    height: "3.4rem",
  },
  filterButtonFilters: {
    marginTop: theme.spacing(1),
    height: "3.4rem",
    backgroundColor: "#464646",
    "&:hover, &:focus": {
      backgroundColor: "#2b2b2b",
    },
    "&:active": {
      backgroundColor: "#464646",
    },
  },
}));

/**
 * Renders a search bar with optional filters
 * @param {GQLAbstract} query - The GQLAbstract object as provided by the parent component
 * @param {Object} searchState - The current state/state-modifier bundle for search
 * @return {JSX.Element}
 * @constructor
 */
const GridTableSearchBar = ({ query, searchState }) => {
  /**
   * The styling of the search bar
   * @constant
   * @default
   */
  const classes = useStyles();

  /**
   * Attempts to retrieve the default placeholder for the search input field
   * @return {string}
   */
  const getSearchPlaceholder = () => {
    try {
      return query.config.search.placeholder;
    } catch {
      return "Enter search value";
    }
  };

  /**
   * Dialog Open State
   * @type {boolean} dialogOpen - True to show, False to hide
   * @function setDialogOpen - Update the state of confirmDialogOpen
   * @default false
   */
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * The current local filter parameters
   * @type {Object} dialogSettings - Contains the dialog's title, message(s) and actions.
   * @function setDialogSettings - Updates the state of confirmDialogOpen
   * @default false
   */
  const [dialogSettings, setDialogSettings] = useState({
    title: null,
    message: null,
    actions: null,
  });

  /**
   * The contents of the search box
   * @type {string} searchFieldValue
   * @function setSearchFieldValue - Sets the state of the field
   * @default {?searchState.searchParameters.value}
   */
  const [searchFieldValue, setSearchFieldValue] = useState(
    (searchState.searchParameters && searchState.searchParameters.value) || ""
  );

  /**
   * Closes the dialog
   */
  const handleDialogClose = () => setDialogOpen(false);

  /**
   * The default acknowledge button
   * @type {JSX.Element}
   * @constant
   * @default
   */
  const closeDialogActions = (
    <Button onClick={handleDialogClose} color="primary" autoFocus>
      OK
    </Button>
  );

  const handleSearchValueChange = value => {
    if (value === "" && searchFieldValue !== "") {
      handleClearSearchResults();
    } else {
      setSearchFieldValue(value);
    }
  };

  /**
   * Handles the submission of our search form
   * @param {Object} e - The event object
   */
  const handleSearchSubmission = event => {
    // Stop if we don't have any value entered in the search field
    if (searchFieldValue.length === 0) {
      setDialogSettings({
        title: "Empty Search Value",
        message: "Enter a valid search value, do not leave empty.",
        actions: closeDialogActions,
      });

      setDialogOpen(true);
      return;
    }

    // Prevent default behavior on any event
    if (event) event.preventDefault();

    // Update state if we are ready, triggers search.
    searchState.setSearchParameters({
      value: searchFieldValue,
    });
  };

  /**
   * Clears the search results
   */
  const handleClearSearchResults = () => {
    setSearchFieldValue("");
    searchState.setSearchParameters({});
  };

  /**
   * Handles special keys typed in the search bar
   * @param {string} key - The key name being typed
   */
  const handleKeyDown = key => {
    switch (key) {
      /**
       * On Escape key, clear the search
       */
      case "Escape":
        handleClearSearchResults();
        break;
      /**
       * On Enter key, initialize the search
       */
      case "Enter":
        handleSearchSubmission(null);
        break;

      default:
        return;
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={8} lg={10}>
        <TextField
          fullWidth
          onChange={e => handleSearchValueChange(e.target.value)}
          onKeyDown={e => handleKeyDown(e.key)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon fontSize="small" color="action">
                  <SearchIcon />
                </SvgIcon>
              </InputAdornment>
            ),
          }}
          placeholder={getSearchPlaceholder()}
          variant="outlined"
          value={searchFieldValue}
        />
      </Grid>
      <Grid item xs={12} sm={4} lg={2}>
        <Button
          className={classes.filterButton}
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<Icon>search</Icon>}
          onClick={handleSearchSubmission}
        >
          Search
        </Button>
      </Grid>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogSettings.title}
        </DialogTitle>
        <DialogContent>
          {typeof dialogSettings.message === "string" ? (
            <DialogContentText id="alert-dialog-description">
              {dialogSettings.message}
            </DialogContentText>
          ) : (
            dialogSettings.message &&
            dialogSettings.message.map((message, messageIndex) => {
              return (
                <DialogContentText key={messageIndex}>
                  {message}
                </DialogContentText>
              );
            })
          )}
        </DialogContent>
        <DialogActions>{dialogSettings.actions}</DialogActions>
      </Dialog>
    </Grid>
  );
};

GridTableSearchBar.propTypes = {
  className: PropTypes.string,
};

export default GridTableSearchBar;
