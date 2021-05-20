import React from "react";
import MapDrawToolbarButton from "./MapDrawToolbarButton";
import { makeStyles } from "@material-ui/core";
import theme from "../../../theme/index";

import { MODES } from "../../../utils/mapDrawHelpers";

export const useToolbarStyles = makeStyles({
  controlContainer: {
    position: "absolute",
    width: 34,
    right: 10,
    top: 56,
    background: theme.palette.background.mapControls,
    boxShadow: "0 0 0 2px rgb(0 0 0 / 10%);",
    borderRadius: 4,
    overflow: "hidden", // Keep the child button elements from poking outside the border radius
    outline: "none",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    cursor: "pointer",
  },
});

const DrawToolbar = ({ selectedModeId, onSwitchMode, onDelete }) => {
  const classes = useToolbarStyles();

  /**
   * Calls onDelete function to delete a point feature from the draw UI
   * @param {Object} e - Event object for click
   */
  const onDeleteClick = e => {
    onDelete(e);
  };

  return (
    <div className={classes.controlContainer}>
      {MODES.map(mode => {
        return (
          <MapDrawToolbarButton
            selectedModeId={selectedModeId}
            onClick={mode.id === "delete" ? onDeleteClick : onSwitchMode}
            key={mode.id}
            mode={mode}
          />
        );
      })}
    </div>
  );
};

export default DrawToolbar;
