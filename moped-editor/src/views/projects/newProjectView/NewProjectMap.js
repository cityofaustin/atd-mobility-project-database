import React, { useState, useRef, useCallback } from "react";
import ReactMapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { Box, makeStyles } from "@material-ui/core";
import { isEqual } from "lodash";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createProjectSelectLayerConfig,
  getGeoJSON,
  getInteractiveIds,
  getLayerSource,
  getFeatureId,
  isFeaturePresent,
  MAPBOX_TOKEN,
  mapConfig,
  mapStyles,
  renderTooltip,
  sumFeaturesSelected,
  useHoverLayer,
  renderFeatureCount,
} from "../../../utils/mapHelpers";

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
  },
});

const NewProjectMap = ({
  selectedLayerIds,
  setSelectedLayerIds,
  featureCollection,
  setFeatureCollection,
}) => {
  const classes = useStyles();
  const mapRef = useRef();
  const featureCount = sumFeaturesSelected(selectedLayerIds);

  const [viewport, setViewport] = useState(mapConfig.mapInit);
  const { handleLayerHover, featureId, hoveredCoords } = useHoverLayer();

  /**
   * Adds or removes an interactive map feature from the project's feature collection and selected IDs array
   * @param {Object} e - Event object for click
   */
  const handleLayerClick = e => {
    const layerSource = getLayerSource(e);

    if (!layerSource) return;

    const { layerIdField } = mapConfig.layerConfigs[layerSource];
    const clickedFeatureId = getFeatureId(e, layerIdField);
    const selectedFeature = getGeoJSON(e);

    const layerIds = selectedLayerIds[layerSource] || [];

    const updatedLayerIds = !layerIds.includes(clickedFeatureId)
      ? [...layerIds, clickedFeatureId]
      : layerIds.filter(id => id !== clickedFeatureId);

    const updatedSelectedIds = {
      ...selectedLayerIds,
      [layerSource]: updatedLayerIds,
    };

    const updatedFeatureCollection = isFeaturePresent(
      selectedFeature,
      featureCollection.features,
      layerIdField
    )
      ? {
          ...featureCollection,
          features: featureCollection.features.filter(
            feature => !isEqual(feature, selectedFeature)
          ),
        }
      : {
          ...featureCollection,
          features: [...featureCollection.features, selectedFeature],
        };

    setSelectedLayerIds(updatedSelectedIds);
    setFeatureCollection(updatedFeatureCollection);
  };

  /**
   * Updates viewport on zoom, scroll, and other events
   * @param {Object} viewport - Mapbox object that stores properties of the map view
   */
  const handleViewportChange = viewport => setViewport(viewport);

  /**
   * Updates viewport on select of location from geocoder form
   * @param {Object} newViewport - Mapbox object that stores updated location for viewport
   */
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
        height="60vh"
        interactiveLayerIds={getInteractiveIds()}
        onHover={handleLayerHover}
        onClick={handleLayerClick}
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
          bbox={mapConfig.geocoderBbox}
          position="top-right"
        />
        {Object.entries(mapConfig.layerConfigs).map(([sourceName, config]) => (
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
                selectedLayerIds
              )}
            />
          </Source>
        ))}
        {renderTooltip(featureId, hoveredCoords, classes.toolTip)}
      </ReactMapGL>
      {renderFeatureCount(featureCount)}
    </Box>
  );
};

export default NewProjectMap;
