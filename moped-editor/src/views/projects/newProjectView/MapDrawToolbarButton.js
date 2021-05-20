import React from "react";
import { makeStyles, Tooltip } from "@material-ui/core";
import theme from "../../../theme/index";

export const useButtonStyles = makeStyles({
  controlRow: ({ isSelected }) => ({
    height: 34,
    padding: 7,
    display: "flex",
    justifyContent: "left",
    background: isSelected && theme.palette.primary.main,
    "&:hover": {
      background: isSelected
        ? theme.palette.primary.main
        : theme.palette.background.mapControlsHover,
    },
  }),
});

const MapDrawToolbarButton = ({ onClick, selectedModeId, mode }) => {
  const isSelected = mode.id === selectedModeId;

  const classes = useButtonStyles({ isSelected });

  return (
    <Tooltip title={mode.text} aria-label={mode.text} placement="left">
      <div
        className={classes.controlRow}
        onClick={onClick}
        key={mode.id}
        id={mode.id}
      >
        <img
          id={mode.id}
          alt={mode.text}
          src={`${process.env.PUBLIC_URL}/static/${mode.icon}`}
        />
      </div>
    </Tooltip>
  );
};

export default MapDrawToolbarButton;
