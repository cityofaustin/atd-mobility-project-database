import React, { useState, useRef, useCallback } from "react";
import ReactMapGL, { Layer, NavigationControl } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { Box, Typography, makeStyles } from "@material-ui/core";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createProjectLayerConfig,
  getPolygonId,
  MAPBOX_TOKEN,
  mapInit,
  renderTooltip,
} from "./mapHelpers";

const useStyles = makeStyles(theme => ({
  locationCountText: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  toolTip: {
    position: "absolute",
    margin: 8,
    padding: 4,
    background: theme.palette.text.primary,
    color: theme.palette.background.default,
    maxWidth: 300,
    fontSize: "0.875rem",
    fontWeight: 500,
    zIndex: 9,
    pointerEvents: "none",
  },
  navStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: "10px",
  },
  mapBox: {
    padding: 25,
  },
}));

const ProjectMap = ({ selectedIds, setSelectedIds }) => {
  const classes = useStyles();
  const mapRef = useRef();

  const [viewport, setViewport] = useState(mapInit);
  const [polygonId, setPolygonId] = useState("");
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredCoords, setHoveredCoords] = useState(null);

  const handleHover = e => {
    const {
      srcEvent: { offsetX, offsetY },
    } = e;

    const polygonId = getPolygonId(e);

    if (!!polygonId) {
      setPolygonId(polygonId);
      setHoveredFeature(polygonId);
      setHoveredCoords({ x: offsetX, y: offsetY });
    } else {
      setHoveredFeature(null);
      setHoveredCoords(null);
      setPolygonId(null);
    }
  };

  const handleClick = e => {
    const polygonId = getPolygonId(e);

    const updatedSelectedIds =
      !!polygonId && !selectedIds.includes(polygonId)
        ? [...selectedIds, polygonId]
        : selectedIds.filter(id => id !== polygonId);

    !!polygonId && setSelectedIds(updatedSelectedIds);
    console.log(e);
  };

  const handleViewportChange = viewport => setViewport(viewport);

  const handleGeocoderViewportChange = useCallback(newViewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return handleViewportChange({
      ...newViewport,
      ...geocoderDefaultOverrides,
    });
  }, []);

  return (
    <Box className={classes.mapBox}>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100%"
        height={500}
        interactiveLayerIds={["location-polygons"]}
        onHover={handleHover}
        onClick={handleClick}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={handleViewportChange}
      >
        <div className={classes.navStyle}>
          <NavigationControl showCompass={false} />
        </div>
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          position="top-right"
        />
        <Layer
          key={"location-polygon"}
          {...createProjectLayerConfig(polygonId, selectedIds)}
        />
        {renderTooltip(hoveredFeature, hoveredCoords, classes.toolTip)}
      </ReactMapGL>
      <Typography className={classes.locationCountText}>
        {selectedIds.length} locations selected
      </Typography>
    </Box>
  );
};

export default ProjectMap;
