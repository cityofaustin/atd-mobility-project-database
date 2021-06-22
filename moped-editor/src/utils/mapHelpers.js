import React, { useState, useEffect } from "react";
import { Layer, Source, WebMercatorViewport } from "react-map-gl";
import bbox from "@turf/bbox";
import theme from "../theme/index";
import {
  Box,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
} from "@material-ui/core";
import { get } from "lodash";

export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
export const NEARMAP_KEY = process.env.REACT_APP_NEARMAP_TOKEN;

const TRAIL_LINE_TYPE = "Off-Street";

// See MOPED Technical Docs > User Interface > Map > react-map-gl-geocoder
const austinFullPurposeJurisdictionFeatureCollection = {
  type: "FeatureCollection",
  crs: {
    type: "name",
    properties: {
      name: "EPSG:4326",
    },
  },
  bbox: [-97.940377, 30.133717, -97.578205, 30.464826],
  features: [],
};

const basemaps = {
  streets: "mapbox://styles/mapbox/light-v8",
  // Provide style parameters to render Nearmap tiles in react-map-gl
  // https://docs.mapbox.com/mapbox-gl-js/example/map-tiles/
  aerial: {
    version: 8,
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: [
          `https://api.nearmap.com/tiles/v3/Vert/{z}/{x}/{y}.jpg?apikey=${NEARMAP_KEY}`,
        ],
        tileSize: 256,
      },
    },
    layers: [
      {
        id: "simple-tiles",
        type: "raster",
        source: "raster-tiles",
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  },
};

export const mapStyles = {
  statusOpacities: {
    selected: 0.75,
    hovered: 0.5,
    unselected: 0.25,
  },
  lineWidthStops: {
    base: 1,
    stops: [
      [10, 1], // [zoom, width in px]
      [13, 2],
      [16, 10],
      [18, 25],
    ],
  },
  circleRadiusStops: {
    base: 1,
    stops: [
      [10, 1], // [zoom, radius in px]
      [13, 2],
      [16, 10],
      [18, 25],
    ],
  },
  toolTipStyles: {
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
};

/**
 * Map Config
 * @type {{mapInit: {latitude: number, zoom: number, longitude: number}, minimumFeaturesInProject: number, geocoderBbox: number[], mapboxDefaultMaxZoom: number, layerConfigs: Object}}
 */
export const mapConfig = {
  // The initial map position and zoom level
  mapInit: {
    latitude: 30.268039,
    longitude: -97.742828,
    zoom: 12,
  },
  mapboxDefaultMaxZoom: 18, // Max zoom level
  minimumFeaturesInProject: 1, // Determines minimum number of features in project
  // Geocoder Bounding Box
  geocoderBbox: austinFullPurposeJurisdictionFeatureCollection.bbox,
  // List of layer configurations
  layerConfigs: {
    CTN: {
      layerLabel: "Streets",
      layerIdName: "ctn-lines",
      layerIdField: "PROJECT_EXTENT_ID",
      tooltipTextProperty: "FULL_STREET_NAME",
      layerIdGetPath: "properties.PROJECT_EXTENT_ID",
      layerOrder: 1,
      layerColor: theme.palette.primary.main,
      layerUrl:
        "https://tiles.arcgis.com/tiles/0L95CJ0VTaxqcmED/arcgis/rest/services/CTN_Project_Extent_VTs_with_Line_Type/VectorTileServer/tile/{z}/{y}/{x}.pbf",
      layerMaxLOD: 14,
      isClickEditable: true,
      get layerStyleSpec() {
        return function(hoveredId, layerIds) {
          const isEditing = !!layerIds;

          const editMapPaintStyles = {
            "line-opacity": [
              "case",
              ["==", ["get", this.layerIdField], hoveredId],
              mapStyles.statusOpacities.hovered,
              ["in", ["get", this.layerIdField], ["literal", layerIds]],
              mapStyles.statusOpacities.selected,
              mapStyles.statusOpacities.unselected,
            ],
          };

          return {
            id: this.layerIdName,
            type: "line",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": [
                "case",
                ["==", ["get", "LINE_TYPE"], TRAIL_LINE_TYPE],
                theme.palette.map.trail,
                this.layerColor,
              ],
              "line-width": mapStyles.lineWidthStops,
              ...(isEditing && editMapPaintStyles),
            },
          };
        };
      },
    },
    Project_Component_Points_prototype: {
      layerLabel: "Points",
      layerIdName: "project-component-points",
      layerIdField: "PROJECT_EXTENT_ID",
      layerIdGetPath: "properties.PROJECT_EXTENT_ID",
      layerOrder: 2,
      layerColor: theme.palette.secondary.main,
      layerUrl:
        "https://tiles.arcgis.com/tiles/0L95CJ0VTaxqcmED/arcgis/rest/services/MOPED_intersection_points/VectorTileServer/tile/{z}/{y}/{x}.pbf",
      layerMaxLOD: 12,
      isClickEditable: true,
      get layerStyleSpec() {
        return function(hoveredId, layerIds) {
          const isEditing = !!layerIds;

          const editMapPaintStyles = {
            "circle-opacity": [
              "case",
              ["==", ["get", this.layerIdField], hoveredId],
              mapStyles.statusOpacities.hovered,
              ["in", ["get", this.layerIdField], ["literal", layerIds]],
              mapStyles.statusOpacities.selected,
              mapStyles.statusOpacities.unselected,
            ],
          };

          return {
            id: this.layerIdName,
            type: "circle",
            paint: {
              "circle-color": this.layerColor,
              "circle-radius": mapStyles.circleRadiusStops,
              ...(isEditing && editMapPaintStyles),
            },
          };
        };
      },
    },
    drawnByUser: {
      layerDrawn: true,
      layerLabel: "Drawn Points",
      layerIdName: "drawnByUser",
      layerIdField: "PROJECT_EXTENT_ID",
      layerIdGetPath: "properties.PROJECT_EXTENT_ID",
      layerOrder: 3,
      layerColor: theme.palette.secondary.main,
      layerMaxLOD: 12,
      isClickEditable: false,
      get layerStyleSpec() {
        return function() {
          return {
            id: this.layerIdName,
            type: "circle",
            paint: {
              "circle-color": this.layerColor,
              "circle-radius": mapStyles.circleRadiusStops,
            },
          };
        };
      },
    },
    drawnByUserLine: {
      layerDrawn: true,
      layerLabel: "Drawn Lines",
      layerIdName: "drawnByUserLine",
      layerIdField: "PROJECT_EXTENT_ID",
      layerIdGetPath: "properties.PROJECT_EXTENT_ID",
      layerOrder: 4,
      layerColor: theme.palette.primary.main,
      layerMaxLOD: 12,
      isClickEditable: false,
      get layerStyleSpec() {
        return function() {
          return {
            id: this.layerIdName,
            type: "line",
            layout: {
              "line-join": "miter",
              "line-cap": "square",
            },
            paint: {
              "line-color": theme.palette.primary.main,
              "line-width": 4,
            },
          };
        };
      },
    },
  },
};

export const mapErrors = {
  minimumLocations: "Select a location to save project",
  failedToSave: "The map edit failed to save. Please try again.",
};

/**
 * Create a Mapbox LngLatBounds object from a bbox generated from a feature collection
 * @param {Object} featureCollection - A GeoJSON feature collection
 * @return {Array} A nested array that fits the LngLatBounds Mapbox object format
 */
export const createZoomBbox = featureCollection => {
  const [minLng, minLat, maxLng, maxLat] = bbox(featureCollection);

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
};

/**
 * Get the layer names from the layerConfigs object for which isClickEditable is true
 * @return {Array} List of source layer names that have features that can be added or removed by clicking
 */
export const getClickEditableLayerNames = () =>
  Object.entries(mapConfig.layerConfigs).reduce(
    (acc, [sourceLayerName, config]) =>
      config.isClickEditable ? [...acc, sourceLayerName] : acc,
    []
  );

/**
 * Get the IDs from the layerConfigs object to set as interactive in the edit map
 * Edit map needs all layers to be interactive to let users select features
 * @return {Array} List of layer IDs to be set as interactive (hover, click) in map
 */
export const getEditMapInteractiveIds = () =>
  Object.values(mapConfig.layerConfigs).map(config => config.layerIdName);

/**
 * Get the IDs from the layerConfigs object to set as interactive in the summary map
 * Summary map only needs layers in the project extent to be interactive
 * @return {Array} List of layer IDs to be set as interactive (hover, click) in map
 */
export const getSummaryMapInteractiveIds = featureCollection => [
  ...new Set(
    featureCollection.features.map(
      feature =>
        mapConfig.layerConfigs[feature.properties.sourceLayer].layerIdName
    )
  ),
];

/**
 * Get the layer names from the layerConfigs object
 * @return {Array} List of layer names set in mapConfig.layerConfigs
 */
export const getLayerNames = () => Object.keys(mapConfig.layerConfigs);

/**
 * Get a feature's ID attribute from a GeoJSON feature
 * @param {Object} feature - GeoJSON feature taken from a Mapbox click or hover event
 * @param {String} layerName - Name of layer to find lodash get path from layer config
 * @return {String} The ID of the polygon clicked or hovered
 */
export const getFeatureId = (feature, layerName) =>
  get(feature, mapConfig.layerConfigs[layerName].layerIdGetPath);

/**
 * Get a feature's property that contains text to show in a tooltip
 * @param {object} feature - GeoJSON feature taken from a Mapbox click or hover event
 * @param {string} layerName - Name of layer to find tooltip text property from layer config
 * @return {string} The text to show in the tooltip
 */
export const getFeatureHoverText = (feature, layerName) =>
  feature.properties[mapConfig.layerConfigs[layerName].tooltipTextProperty];

/**
 * Get a feature's layer source from a Mapbox map click or hover event
 * @param {Object} e - Event object for click or hover on map
 * @return {String} The name of the source layer
 */
export const getLayerSource = e =>
  e.features &&
  e.features.length > 0 &&
  (e.features[0].layer["source-layer"] ||
    e.features[0].properties["sourceLayer"]);

/**
 * Create a GeoJSON feature collection from project features
 * @param {array} projectFeatureRecords - List of project's feature records from the moped_proj_features table
 * @return {object} A GeoJSON feature collection to display project features on a map
 */
export const createFeatureCollectionFromProjectFeatures = projectFeatureRecords => ({
  type: "FeatureCollection",
  features: projectFeatureRecords
    ? projectFeatureRecords.map(feature => feature.location)
    : [],
});

/**
 * Create object with layer name keys and array values containing feature IDs for map styling
 * @param {object} featureCollection - A GeoJSON feature collection
 * @return {object} Object with layer name keys and values that are a array of feature ID strings
 */
export const createSelectedIdsObjectFromFeatureCollection = featureCollection => {
  const selectedIdsByLayer = featureCollection.features.reduce(
    (acc, feature) => {
      const featureSourceLayerName = feature.properties.sourceLayer;
      const featureId = getFeatureId(feature, featureSourceLayerName);

      return acc[featureSourceLayerName]
        ? {
            ...acc,
            ...{
              [featureSourceLayerName]: [
                ...acc[featureSourceLayerName],
                featureId,
              ],
            },
          }
        : { ...acc, [featureSourceLayerName]: [featureId] };
    },
    {}
  );

  return selectedIdsByLayer;
};

/**
 * Get a feature's GeoJSON from a Mapbox map click or hover event
 * @param {Object} e - Event object for click or hover on map
 * @return {Object} The GeoJSON object that describes the clicked or hovered feature geometry
 */
export const getGeoJSON = e =>
  e.features &&
  e.features.length > 0 && {
    geometry: e.features[0].geometry,
    id: e.features[0].id,
    properties: {
      ...e.features[0].properties,
      sourceLayer: e.features[0].sourceLayer,
    },
    type: e.features[0].type,
  };

/**
 * Determine if a feature is present/absent from the feature collection state
 * @param {Object} selectedFeature - Feature selected
 * @param {Array} features - Array of GeoJSON features
 * @param {String} layerName - Name of layer to find lodash get path from layer config
 * @return {Boolean} Is feature present in features of feature collection in state
 */
export const isFeaturePresent = (selectedFeature, features, layerName) => {
  const featureGetPath = mapConfig.layerConfigs[layerName].layerIdGetPath;

  return features.some(
    feature =>
      get(selectedFeature, featureGetPath) === get(feature, featureGetPath)
  );
};

/**
 * Create a configuration to set the Mapbox spec styles for selected/unselected/hovered layer features
 * @param {String} hoveredId - The ID of the feature hovered
 * @param {String} sourceName - Source name to get config properties for layer styles
 * @param {Array} selectedLayerIds - Array of string IDs that a user has selected
 * @param {Array} visibleLayerIds - Array of layer names that are visible and have checked boxes in the useLayerSelect UI
 * @return {Object} Mapbox layer style object
 */
export const createProjectSelectLayerConfig = (
  hoveredId,
  sourceName,
  selectedLayerIds,
  visibleLayerIds
) => {
  const layerIds = selectedLayerIds[sourceName] || [];
  const config = mapConfig.layerConfigs[sourceName];

  // Merge common layer attributes with those unique to each layer type
  let layerStyleSpec = {
    "source-layer": sourceName,
    ...config.layerStyleSpec(hoveredId, layerIds),
  };

  if (!!visibleLayerIds) {
    layerStyleSpec = {
      ...layerStyleSpec,
      layout: {
        ...layerStyleSpec.layout,
        visibility: visibleLayerIds.includes(sourceName) ? "visible" : "none",
      },
    };
  }

  return layerStyleSpec;
};

/**
 * Create sources and layers for each source layer in the project's GeoJSON FeatureCollection
 * @param {object} geoJSON - A GeoJSON feature collection with project features
 * @return {JSX} Mapbox Source and Layer components for each source in the GeoJSON
 */
export const createSummaryMapLayers = geoJSON => {
  /**
   * Aggregate all features in geoJSON and group by layer
   */
  const geoJSONBySource = geoJSON.features.reduce((acc, feature) => {
    // Copy the sourceLayerName
    const sourceLayerName = feature.properties.sourceLayer;

    /**
     * Build a new state that copies the current state of the accumulator
     * and append a new key with the source layer name, which includes a
     * copy of the geoJSON object, a features section which includes the current
     * feature and any extra features already in the aggregator if any.
     */
    return {
      ...acc,
      [sourceLayerName]: {
        ...geoJSON,
        features: [
          ...(acc[sourceLayerName] ? acc[sourceLayerName].features : []),
          feature,
        ],
      },
    };
  }, {});

  /**
   * For every source layer in geoJSONBySource
   */
  return (
    Object.entries(geoJSONBySource)
      .map(([sourceLayerName, sourceLayerGeoJSON]) => (
        // Build a source component, and pass attributes
        <Source
          key={sourceLayerName}
          id={sourceLayerName}
          type="geojson"
          data={sourceLayerGeoJSON}
        >
          {/*
          Build a layer and create a configuration to set the
          Mapbox spec styles for persisted layer features
        */}
          <Layer
            key={sourceLayerName}
            {...createProjectViewLayerConfig(sourceLayerName)}
          />
        </Source>
      ))
      /* We can now sort the components by mapConfig.layerConfigs[n].layerOrder */
      .sort((a, b) => {
        // The id of the Source component maps to the source layer names in mapConfig, each layer config has a set order
        const idA = a.props.id;
        const idB = b.props.id;
        const orderA = mapConfig.layerConfigs[idA].layerOrder;
        const orderB = mapConfig.layerConfigs[idB].layerOrder;

        return orderA > orderB ? 1 : -1;
      })
  );
};

/**
 * Create a configuration to set the Mapbox spec styles for persisted layer features
 * @summary The fill color key's value below is a Mapbox "case" expression whose cases are
 * built in fillColorCases above. These cases use the sourceLayer and color values set in
 * layerConfigs to set colors of features in the projectExtent feature collection layer on the map.
 * @param {string} sourceName - Source name to get config properties for layer styles
 * @param {Array} visibleLayerIds - Array of layer names that are visible and have checked boxes in the useLayerSelect UI
 * @return {object} Mapbox layer style object
 */
export const createProjectViewLayerConfig = (
  sourceName,
  visibleLayerIds = null
) => {
  let layerStyleSpec =
    mapConfig.layerConfigs[sourceName]?.layerStyleSpec() ?? null;

  if (!!layerStyleSpec && !!visibleLayerIds) {
    layerStyleSpec = {
      ...layerStyleSpec,
      layout: {
        ...layerStyleSpec.layout,
        visibility: visibleLayerIds.includes(sourceName) ? "visible" : "none",
      },
    };
  }

  return layerStyleSpec;
};

/**
 * Build the JSX of the hover tooltip on map
 * @param {String} tooltipText - Text to show in the tooltip
 * @param {Object} hoveredCoords - Object with keys x and y that describe position of cursor
 * @param {Object} className - Styles from the classes object
 * @return {JSX} The populated tooltip JSX
 */
export const renderTooltip = (tooltipText, hoveredCoords, className) =>
  tooltipText && (
    <div
      className={className}
      style={{
        left: hoveredCoords?.x,
        top: hoveredCoords?.y,
      }}
    >
      <div>{tooltipText}</div>
    </div>
  );

/**
 * Build the JSX for the map feature count subtext
 * @param {Number} featureCount - The number of features in a project's feature collection
 * @return {JSX} The populated feature count text JSX
 */
export const renderFeatureCount = featureCount => (
  <Typography
    style={{
      fontSize: "0.875rem",
      fontWeight: 500,
    }}
  >
    {featureCount} location{featureCount === 1 ? "" : "s"} in this project
  </Typography>
);

/**
 * Count the number of features in the project extent feature collection
 * @param {Object} featureCollection - A GeoJSON feature collection
 * @return {Number} Total number of string IDs
 */
export const countFeatures = featureCollection =>
  featureCollection.features.length;

/**
 * Custom hook that returns a vector tile layer hover event handler and the details to place and populate a tooltip
 * @return {{handleLayerHover:Function, featuredId:String, hoveredCoords:Object}}
 * @return {HoverObject} Object that exposes the setter and getters for a hovered feature
 */
/**
 * @typedef {Object} HoverObject
 * @property {Function} handleLayerHover - Function that get and sets featureId and Point for tooltip
 * @property {String} featuredId - The ID of the hovered feature
 * @property {String} featuredText - Text from feature property to show in tooltip
 * @property {Point} hoveredCoords - The coordinates used to place the tooltip
 */
/**
 * @typedef {Object} Point
 * @property {Number} x - The x coordinate to the place the tooltip
 * @property {Number} y - The y coordinate to the place the tooltip
 */
export function useHoverLayer() {
  const [featureText, setFeatureText] = useState(null);
  const [featureId, setFeatureId] = useState(null);
  const [hoveredCoords, setHoveredCoords] = useState(null);

  /**
   * Gets and sets data from a map feature used to populate and place a tooltip
   * @param {Object} e - Mouse hover event that supplies the feature details and hover coordinates
   */
  const handleLayerHover = e => {
    const layerSource = getLayerSource(e);

    // If a layer isn't hovered, reset state and don't proceed
    if (!layerSource) {
      setHoveredCoords(null);
      setFeatureText(null);
      setFeatureId(null);
      return;
    }

    // Otherwise, get details for tooltip
    const {
      srcEvent: { offsetX, offsetY },
    } = e;
    const featureId = getFeatureId(e.features[0], layerSource);
    const hoveredFeatureText = getFeatureHoverText(e.features[0], layerSource);

    setFeatureText(hoveredFeatureText);
    setFeatureId(featureId);
    setHoveredCoords({ x: offsetX, y: offsetY });
  };

  return { handleLayerHover, featureId, featureText, hoveredCoords };
}

/**
 * Custom hook that initializes a map viewport and fits it to a provided feature collection
 * @param {object} mapRef - Ref object whose current property exposes the map instance
 * @param {object} featureCollection - A GeoJSON feature collection to fit the map bounds around
 * @param {boolean} shouldFitOnUpdate - Determines if map fits to featuresCollection if collection updates
 * @return {ViewportStateArray} Array that exposes the setter and getters for map viewport using useState hook
 */
/**
 * @typedef {array} ViewportStateArray
 * @property {object} StateArray[0] - A Mapbox viewport object
 * @property {function} StateArray[1] - Setter for viewport state
 */
export function useFeatureCollectionToFitBounds(
  mapRef,
  featureCollection,
  shouldFitOnFeatureUpdate = true
) {
  const [viewport, setViewport] = useState(mapConfig.mapInit);
  const [hasFitInitialized, setHasFitInitialized] = useState(false);

  useEffect(() => {
    if (!mapRef?.current) return;
    if (!shouldFitOnFeatureUpdate && hasFitInitialized) return;

    const mapBounds = createZoomBbox(featureCollection);
    const currentMap = mapRef.current;
    /**
     * Takes the existing viewport and transforms it to fit the project's features
     * @param {Object} viewport - Describes the map view
     * @return {Object} Viewport object with updated attributes based on project's features
     */
    const fitViewportToBounds = viewport => {
      if (featureCollection.features.length === 0) return viewport;
      const featureViewport = new WebMercatorViewport({
        viewport,
        width: currentMap?._width ?? window.innerWidth * 0.45,
        height: currentMap?._height ?? window.innerHeight * 0.6,
      });

      const newViewport = featureViewport.fitBounds(mapBounds, {
        padding: 100,
      });

      const { longitude, latitude, zoom } = newViewport;

      return {
        ...viewport,
        longitude,
        latitude,
        zoom,
      };
    };

    setViewport(prevViewport => fitViewportToBounds(prevViewport));
    setHasFitInitialized(true);
  }, [hasFitInitialized, shouldFitOnFeatureUpdate, featureCollection, mapRef]);

  return [viewport, setViewport];
}

/**
 * Custom hook that creates a layer toggle UI
 * @param {array} initialSelectedLayerNames - Array of layer names to show initially
 * @param {object} classes - Holds Material UI classnames
 * @return {UseLayerObject} Object that exposes updated array of visible layers and map UI render function
 */
/**
 * @typedef {object} UseLayerObject
 * @property {array} visibleLayerIds - Updated list of visible map layers
 * @property {function} renderLayerSelect - Function that returns JSX for layer toggle UI
 */
export function useLayerSelect(initialSelectedLayerNames, classes) {
  const [visibleLayerIds, setVisibleLayerIds] = useState(
    initialSelectedLayerNames
  );
  const [mapStyle, setMapStyle] = useState("streets");
  const mapStyleConfig = basemaps[mapStyle];

  /**
   * Takes a click event and adds/removes a layer name from the visible layers array
   * @param {Object} e - Mouse click event that supplies layer name
   */
  const handleLayerCheckboxClick = e => {
    const layerName = e.target.name;

    setVisibleLayerIds(prevLayers => {
      return prevLayers.includes(layerName)
        ? [...prevLayers.filter(name => name !== layerName)]
        : [...prevLayers, layerName];
    });
  };

  /**
   * Takes a click event and sets a basemap key string so a value can be read from the basemaps object
   * @param {Object} e - Mouse click event that supplies basemaps object key from the radio button
   */
  const handleBasemapChange = e => {
    const basemapKey = e.target.value;

    setMapStyle(basemapKey);
  };

  const renderLayerSelect = () => (
    <Box component="div" className={classes.layerSelectBox}>
      <Typography className={classes.layerSelectTitle}>Layers</Typography>
      {getLayerNames().map(name => (
        <Typography key={name} className={classes.layerSelectText}>
          <Checkbox
            checked={visibleLayerIds.includes(name)}
            onChange={handleLayerCheckboxClick}
            name={name}
            color="primary"
          />
          {mapConfig.layerConfigs[name].layerLabel}
        </Typography>
      ))}
      <Typography className={classes.layerSelectTitle}>Basemap</Typography>
      <RadioGroup
        aria-label="basemap"
        name="basemap"
        className={classes.layerRadioGroup}
        value={mapStyle}
        onChange={handleBasemapChange}
      >
        <FormControlLabel
          value="streets"
          control={<Radio color="primary" />}
          label="Streets"
        />
        <FormControlLabel
          value="aerial"
          control={<Radio color="primary" />}
          label="Aerial"
        />
      </RadioGroup>
    </Box>
  );

  return { visibleLayerIds, renderLayerSelect, mapStyleConfig };
}

export const layerSelectStyles = {
  layerSelectBox: {
    position: "absolute",
    top: 105,
    left: 35,
    background: theme.palette.background.mapControls,
    boxShadow: "0 0 0 2px rgb(0 0 0 / 10%);",
    borderRadius: 4,
    zIndex: 1,
  },
  layerSelectTitle: {
    fontWeight: "bold",
    padding: "10px 10px 0px 10px",
  },
  layerSelectText: {
    paddingRight: 10,
  },
  layerRadioGroup: {
    paddingLeft: 10,
  },
};

/**
 * Generates a list of all layers that are drawn
 */
export const drawnLayerNames = Object.entries(mapConfig.layerConfigs)
  .filter(([layerName, layer]) => layer.layerDrawn)
  .map(([layerName, layer]) => layer.layerIdName);
