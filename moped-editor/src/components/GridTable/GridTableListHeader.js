import React from "react";

import { TableHead, TableRow, TableCell } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

/**
 * GridTableListHeader Styles
 */
const useStyles = makeStyles(theme => ({
  columnTitle: {
    "font-weight": "bold",
  },
}));

/**
 * GridTableListHeader Component
 * @param {GQLAbstract} query - The GQLAbstract class passed down for reference
 * @param {function} handleTableHeaderClick - A handler for table header clicks
 * @param {string} sortColumn - The name of the column to sort by
 * @param {string} sortOrder - The order in which the sorting is made: asc, desc
 * @param {string} helperText - Any helper text
 * @return {JSX.Element}
 * @constructor
 */
const GridTableListHeader = ({
  query,
  handleTableHeaderClick,
  sortColumn,
  sortOrder,
}) => {
  const classes = useStyles();

  /**
   * Renders a label with sorting icons going up or down
   * @param {string} col - The name of the column (label)
   * @param {boolean} sortable - True if the column is sortable
   * @param {boolean} ascending - True if ordering in ascending mode
   * @returns {object} jsx component
   */
  const renderLabel = (col, sortable = false, ascending = false) => {
    return (
      <span className={classes.columnTitle}>
        {sortable && (
          <i className={`fa fa-arrow-circle-${ascending ? "up" : "down"}`} />
        )}{" "}
        &nbsp;{col}
      </span>
    );
  };

  return (
    <TableHead>
      <TableRow>
        {query.columns.map(
          (column, index) =>
            // If column is hidden, don't render <th>
            !query.isHidden(column) && (
              <TableCell
                onClick={
                  query.isSortable(column)
                    ? e => handleTableHeaderClick(column)
                    : null
                }
                key={`th-${index}`}
              >
                {renderLabel(
                  // Get a human-readable label string
                  query.getLabel(column, "table"),
                  // If it is sortable, render as such
                  query.isSortable(column),
                  // If sort column is defined, use sort order, or false as default
                  sortColumn === column ? sortOrder === "asc" : false
                )}
              </TableCell>
            )
        )}
      </TableRow>
    </TableHead>
  );
};

export default GridTableListHeader;
