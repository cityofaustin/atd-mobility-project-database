import React, { useRef, useCallback } from "react";
import ReactMapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { Box, Button, makeStyles, Switch, Typography } from "@material-ui/core";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createProjectSelectLayerConfig,
  createProjectViewLayerConfig,
  createSelectedIdsObjectFromFeatureCollection,
  drawnLayerNames,
  getClickEditableLayerNames,
  getGeoJSON,
  getEditMapInteractiveIds,
  getLayerNames,
  getLayerSource,
  getFeatureId,
  isFeaturePresent,
  layerSelectStyles,
  MAPBOX_TOKEN,
  mapConfig,
  mapStyles,
  renderTooltip,
  countFeatures,
  useFeatureCollectionToFitBounds,
  useHoverLayer,
  useLayerSelect,
  renderFeatureCount,
} from "../../../utils/mapHelpers";

import { useMapDrawTools } from "../../../utils/mapDrawHelpers";

export const useStyles = makeStyles({
  toolTip: mapStyles.toolTipStyles,
  navStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: "10px",
  },
  mapBox: {
    padding: 25,
    position: "relative",
  },
  geocoderContainer: {
    display: "flex",
    height: 50,
    position: "absolute",
    alignItems: "center",
    right: 32,
    // Keep geocoder input in set position when mapbox-gl-geocoder.css media queries kick in
    "@media (max-width:640px)": {
      top: 32,
    },
  },
  ...layerSelectStyles,
});

const NewProjectMap = ({
  featureCollection,
  setFeatureCollection,
  projectId = null,
  refetchProjectDetails = null,
}) => {
  const classes = useStyles();
  const mapRef = useRef();
  const featureCount = countFeatures(featureCollection);
  const selectedLayerIds = createSelectedIdsObjectFromFeatureCollection(
    featureCollection
  );
  const mapControlContainerRef = useRef();

  const [viewport, setViewport] = useFeatureCollectionToFitBounds(
    mapRef,
    featureCollection,
    false
  );

  const {
    handleLayerHover,
    featureText,
    featureId,
    hoveredCoords,
  } = useHoverLayer();

  const { visibleLayerIds, renderLayerSelect, mapStyleConfig } = useLayerSelect(
    getLayerNames(),
    classes
  );

  const {
    isDrawing,
    setIsDrawing,
    renderMapDrawTools,
    saveDrawnPoints,
  } = useMapDrawTools(
    featureCollection,
    setFeatureCollection,
    projectId,
    refetchProjectDetails,
    viewport.zoom
  );

  /**
   * Adds or removes an interactive map feature from the project's feature collection and selected IDs array
   * @param {Object} e - Event object for click
   */
  const handleLayerClick = e => {
    const layerName = getLayerSource(e);

    // If a user clicks a drawn point in the map, open draw UI
    if (drawnLayerNames.includes(layerName)) {
      setIsDrawing(true);
    }

    if (!layerName || !getClickEditableLayerNames().includes(layerName)) return;

    const clickedFeatureId = getFeatureId(e.features[0], layerName);
    const selectedFeature = getGeoJSON(e);

    const updatedFeatureCollection = isFeaturePresent(
      selectedFeature,
      featureCollection.features,
      layerName
    )
      ? {
          ...featureCollection,
          features: featureCollection.features.filter(
            feature => getFeatureId(feature, layerName) !== clickedFeatureId
          ),
        }
      : {
          ...featureCollection,
          features: [...featureCollection.features, selectedFeature],
        };

    setFeatureCollection(updatedFeatureCollection);
  };

  /**
   * Updates viewport on zoom, scroll, and other events
   * @param {Object} viewport - Mapbox object that stores properties of the map view
   */
  const handleViewportChange = useCallback(
    viewport => setViewport(prevViewport => ({ ...prevViewport, ...viewport })),
    [setViewport]
  );

  /**
   * Updates viewport on select of location from geocoder form
   * @param {Object} newViewport - Mapbox object that stores updated location for viewport
   */
  const handleGeocoderViewportChange = useCallback(
    newViewport => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );

  /**
   * Customize cursor depending on user actions
   * @param {object} pointerStates - Object containing pointer state keys and boolean values
   * @param {boolean} pointerStates.isHovering - Is user hovering an interactive feature
   * @param {boolean} pointerStates.isDragging - Is user dragging map
   */
  const getCursor = ({ isHovering, isDragging }) => {
    return isDragging
      ? "grabbing"
      : isHovering || isDrawing // Show pointer when user is drawing as well
      ? "pointer"
      : "default";
  };

  return (
    <Box className={classes.mapBox}>
      {/* Render these controls outside ReactMapGL so mouse events don't propagate to the map */}
      <div ref={mapControlContainerRef} className={classes.geocoderContainer} />
      {renderLayerSelect()}
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100%"
        height="60vh"
        interactiveLayerIds={!isDrawing && getEditMapInteractiveIds()}
        onHover={!isDrawing ? handleLayerHover : null}
        onClick={!isDrawing ? handleLayerClick : null}
        getCursor={getCursor}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={handleViewportChange}
        mapStyle={mapStyleConfig}
      >
        <div className={classes.navStyle}>
          <NavigationControl showCompass={false} captureClick={false} />
        </div>
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          bbox={mapConfig.geocoderBbox}
          containerRef={mapControlContainerRef}
          marker={false}
          position="top-right"
        />
        {Object.entries(mapConfig.layerConfigs).map(([sourceName, config]) =>
          // If a config has a url, it is needs state to update selected/unselected layers
          config.layerUrl ? (
            <Source
              key={config.layerIdName}
              type="vector"
              tiles={[config.layerUrl]}
              maxzoom={config.layerMaxLOD || mapConfig.mapboxDefaultMaxZoom} // maxLOD found in vector tile layer metadata
            >
              <Layer
                key={config.layerIdName}
                {...createProjectSelectLayerConfig(
                  featureId,
                  sourceName,
                  selectedLayerIds,
                  visibleLayerIds
                )}
              />
            </Source>
          ) : (
            <Source
              key={config.layerIdName}
              id={config.layerIdName}
              type="geojson"
              data={{
                ...featureCollection,
                features: [
                  ...featureCollection.features.filter(
                    feature => feature.properties.sourceLayer === sourceName
                  ),
                ],
              }}
            >
              <Layer
                key={config.layerIdName}
                {...createProjectViewLayerConfig(
                  config.layerIdName,
                  visibleLayerIds
                )}
              />
            </Source>
          )
        )}
        {renderTooltip(featureText, hoveredCoords, classes.toolTip)}
        {isDrawing && renderMapDrawTools()}
      </ReactMapGL>
      {renderFeatureCount(featureCount)}
      <Switch
        checked={isDrawing}
        onChange={() => setIsDrawing(!isDrawing)}
        color="primary"
        name="mapDrawSwitch"
        inputProps={{ "aria-label": "primary checkbox" }}
      />
      <Typography>Draw Mode</Typography>
      {isDrawing && (
        <Button variant="contained" color="primary" onClick={saveDrawnPoints}>
          Save Drawn Points
        </Button>
      )}
    </Box>
  );
};

export default NewProjectMap;
