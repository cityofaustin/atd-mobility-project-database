import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { NavLink as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
  makeStyles,
  Link,
  Chip,
  Icon,
  TableContainer,
} from "@material-ui/core";

// GridTable
import GridTableListHeader from "./GridTableListHeader";
import GridTablePagination from "./GridTablePagination";

// Styles
const useStyles = makeStyles(() => ({
  root: {},
  container: {
    maxHeight: "55vh",
  },
  tableCell: {
    "text-transform": "capitalize",
  },
}));

/**
 * Builds a List of items using the Table component in Material-UI
 * @param {GQLAbstract} query - The GQLAbstract class passed down as reference
 * @param {Object} data - An array of objects containing the data for each item
 * @param {string} helperText - Helper Text
 * @return {JSX.Element}
 * @constructor
 */
const GridTableList = ({ query, data, helperText }) => {
  const classes = useStyles();
  const items = data[query.config.table] || [];

  /**
   * Parses a PostgreSQL timestamp string and returns a human-readable date-time string
   * @param {string} date - The date as provided by the database
   * @return {string}
   */
  const parseDateReadable = date => {
    return new Date(date).toLocaleDateString();
  };

  /**
   * Removes any non-alphanumeric characters from a string
   * @param {str} input - The text to be cleaned
   * @returns {str}
   */
  const cleanUpText = input => {
    return String(input).replace(/[^0-9a-z]/gi, "");
  };

  /**
   * Returns a Chip object containing the status of the project.
   * @param {str} status - The status of the project as string
   * @return {JSX.Element}
   */
  const getProjectStatus = status => {
    const statusColorMap = {
      active: "primary",
      hold: "secondary",
      canceled: "disabled",
    };

    const statusLabel = cleanUpText(status);
    return String(status) !== "" ? (
      <Chip
        color={statusColorMap[statusLabel.toLowerCase()] || "disabled"}
        size={"small"}
        label={statusLabel}
      />
    ) : (
      <span>No Status</span>
    );
  };

  return (
    <Card className={classes.root}>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          {helperText && (
            <Box display="flex" justifyContent="flex-end">
              <small>{helperText}</small>
            </Box>
          )}
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <GridTableListHeader query={query} />
              <TableBody>
                {items.map(project => (
                  <TableRow hover key={project.project_id}>
                    <TableCell align="center">
                      <RouterLink to={`/moped/projects/${project.project_id}`}>
                        <Icon color={"primary"}>edit_road</Icon>
                      </RouterLink>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      <Link href={"/moped/projects/" + project.project_id}>
                        {project.project_name}
                      </Link>
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {project.project_description}
                    </TableCell>
                    <TableCell className={classes.tableCell}>
                      {getProjectStatus(project.current_status)}
                    </TableCell>
                    <TableCell>
                      {parseDateReadable(project.date_added)}
                    </TableCell>
                    <TableCell>
                      {parseDateReadable(project.start_date)}
                    </TableCell>
                    <TableCell>
                      {project.capitally_funded ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <GridTablePagination query={query} data={data} />
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

export default GridTableList;
