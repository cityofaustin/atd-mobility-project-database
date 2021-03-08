import React, { useRef } from "react";
import ReactMapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import { Box, Button, makeStyles } from "@material-ui/core";
import { EditLocation as EditLocationIcon } from "@material-ui/icons";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createProjectViewLayerConfig,
  MAPBOX_TOKEN,
  mapStyles,
  renderTooltip,
  renderFeatureCount,
  sumFeaturesSelected,
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

const ProjectSummaryMap = ({
  selectedLayerIds,
  projectExtentGeoJSON,
  setIsEditing,
}) => {
  const classes = useStyles();
  const mapRef = useRef();
  const featureCount = sumFeaturesSelected(selectedLayerIds);

  const { handleLayerHover, featureId, hoveredCoords } = useHoverLayer();
  const [viewport, setViewport] = useFeatureCollectionToFitBounds(
    mapRef,
    projectExtentGeoJSON
  );

  /**
   * Updates viewport on zoom, scroll, and other events
   * @param {Object} viewport - Mapbox object that stores properties of the map view
   */
  const handleViewportChange = viewport => setViewport(viewport);

  return (
    <Box>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100%"
        height="60vh"
        interactiveLayerIds={["projectExtent"]}
        onHover={handleLayerHover}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={handleViewportChange}
      >
        <div className={classes.navStyle}>
          <NavigationControl showCompass={false} />
        </div>
        {projectExtentGeoJSON && (
          <Source type="geojson" data={projectExtentGeoJSON}>
            <Layer {...createProjectViewLayerConfig()} />
          </Source>
        )}
        {renderTooltip(featureId, hoveredCoords, classes.toolTip)}
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
