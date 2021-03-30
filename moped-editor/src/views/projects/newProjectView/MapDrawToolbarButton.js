import React from "react";
import { makeStyles } from "@material-ui/core";

export const useButtonStyles = makeStyles({
  controlTooltip: {
    position: "absolute",
    right: 44,
    padding: 4,
    background: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    borderRadius: 4,
    minWidth: 100,
    maxWidth: 300,
    height: 24,
    fontSize: 12,
    zIndex: 9,
    pointerEvents: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  controlRow: ({ selected }) => ({
    height: 34,
    padding: 7,
    display: "flex",
    justifyContent: "left",
    background: selected ? "#0071bc" : "inherit",
    "&:hover": {
      background: selected ? "#0071bc" : "#e6e6e6",
    },
  }),
});

const MapDrawToolbarButton = ({
  onClick,
  selectedModeId,
  mode,
  hoveredId,
  onHover,
}) => {
  console.log(selectedModeId);
  const selected = mode.id === selectedModeId;
  const hovered = mode.id === hoveredId;

  const classes = useButtonStyles({ selected, hovered });

  return (
    <div
      className={classes.controlRow}
      onClick={onClick}
      onMouseOver={onHover}
      onMouseOut={() => onHover(null)}
      key={mode.id}
      id={mode.id}
    >
      <img
        id={mode.id}
        onMouseOver={onHover}
        alt={mode.text}
        src={`${process.env.PUBLIC_URL}/static/${mode.icon}`}
      />
      {hoveredId === mode.id && (
        <div className={classes.controlTooltip}>{mode.text}</div>
      )}
    </div>
  );
};

export default MapDrawToolbarButton;