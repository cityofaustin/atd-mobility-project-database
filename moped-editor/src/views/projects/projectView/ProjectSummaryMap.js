import React, { useRef } from "react";
import ReactMapGL, { NavigationControl } from "react-map-gl";
import { Box, Button, makeStyles } from "@material-ui/core";
import { EditLocation as EditLocationIcon } from "@material-ui/icons";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createSummaryMapLayers,
  getSummaryMapInteractiveIds,
  MAPBOX_TOKEN,
  mapStyles,
  renderTooltip,
  renderFeatureCount,
  countFeatures,
  useHoverLayer,
  useFeatureCollectionToFitBounds,
} from "../../../utils/mapHelpers";

const useStyles = makeStyles({
  locationCountText: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  toolTip: mapStyles.toolTipStyles,
  navStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: "10px",
  },
  editButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});

const ProjectSummaryMap = ({ projectExtentGeoJSON, setIsEditing }) => {
  const classes = useStyles();
  const mapRef = useRef();
  const featureCount = countFeatures(projectExtentGeoJSON);

  /**
   * Make use of a custom hook that returns a vector tile layer hover event handler
   * and the details to place and populate a tooltip.
   */
  const { handleLayerHover, featureText, hoveredCoords } = useHoverLayer();

  /**
   * Make use of a custom hook that initializes a map viewport
   * and fits it to a provided feature collection.
   */
  const [viewport, setViewport] = useFeatureCollectionToFitBounds(
    mapRef,
    projectExtentGeoJSON
  );

  /**
   * Updates viewport on zoom, scroll, and other events
   * @param {Object} updatedViewPort - Mapbox object that stores properties of the map view
   */
  const handleViewportChange = updatedViewPort => setViewport(updatedViewPort);

  /**
   * Let's throw an error intentionally if there are no features for a project.
   */
  if(featureCount < 1) {
    throw Error("Map error: Cannot render or edit maps with no features");
  }

  /**
   * If we do have features, proceed to render map.
   */
  return (
    <Box>
      <ReactMapGL
        /* Current state of viewport */
        {...viewport}
        /* Object reference to this object */
        ref={mapRef}
        width="100%"
        height="60vh"
        /* Access Key */
        mapboxApiAccessToken={MAPBOX_TOKEN}
        /* Get the IDs from the layerConfigs object to set as interactive in the summary map */
        /* If specified: Pointer event callbacks will only query the features under the pointer of these layers.
              The getCursor callback will receive isHovering: true when hover over features of these layers */
        interactiveLayerIds={getSummaryMapInteractiveIds(projectExtentGeoJSON)}
        /* Gets and sets data from a map feature used to populate and place a tooltip */
        onHover={handleLayerHover}
        /* Updates state of viewport on zoom, scroll, and other events */
        onViewportChange={handleViewportChange}
      >
        {/* Draw Navigation controls with specific styles */}
        <div className={classes.navStyle}>
          <NavigationControl showCompass={false} />
        </div>
        {/*
          If there is GeoJSON data, create sources and layers for
          each source layer in the project's GeoJSON FeatureCollection
        */}
        {projectExtentGeoJSON && createSummaryMapLayers(projectExtentGeoJSON)}
        {/* Draw tooltip on feature hover */}
        {renderTooltip(featureText, hoveredCoords, classes.toolTip)}
        {/* Draw edit button controls with specific styles */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditing(true)}
          startIcon={<EditLocationIcon />}
          className={classes.editButton}
        >
          Edit
        </Button>
      </ReactMapGL>
      {renderFeatureCount(featureCount)}
    </Box>
  );
};

export default ProjectSummaryMap;
