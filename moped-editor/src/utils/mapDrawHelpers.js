import React, { useState, useRef, useCallback } from "react";
import MapDrawToolbar from "../views/projects/newProjectView/MapDrawToolbar";
import { Editor } from "react-map-gl-draw";
import {
  DrawLineStringMode,
  DrawPointMode,
  EditingMode,
  RENDER_STATE,
  SHAPE,
} from "react-map-gl-draw";
import { v4 as uuidv4 } from "uuid";
import { get } from "lodash";
import theme from "../theme/index";
import { mapStyles, drawnLayerNames } from "../utils/mapHelpers";
import { UPSERT_PROJECT_EXTENT } from "../queries/project";
import { useMutation } from "@apollo/client";

export const MODES = [
  {
    id: "drawPoint",
    text: "Draw Point",
    handler: DrawPointMode,
    icon: "icon-point.svg",
  },
  {
    id: "drawLine",
    text: "Draw Line",
    handler: DrawLineStringMode,
    icon: "icon-line-draw.svg",
  },
  {
    id: "edit",
    text: "Select Point",
    handler: EditingMode,
    icon: "icon-select.svg",
  },
  {
    id: "delete",
    text: "Delete",
    icon: "icon-delete.svg",
  },
];

const STROKE_COLOR = theme.palette.primary.main;
const FILL_COLOR = theme.palette.primary.main;

const SELECTED_STYLE = {
  stroke: STROKE_COLOR,
  strokeWidth: 8,
  fill: FILL_COLOR,
  fillOpacity: 0,
};

const HOVERED_STYLE = {
  stroke: STROKE_COLOR,
  strokeWidth: 8,
  fill: FILL_COLOR,
  fillOpacity: 0,
};

const DEFAULT_STYLE = {
  stroke: theme.palette.primary.main,
  strokeWidth: 4,
  fill: theme.palette.secondary.main,
  fillOpacity: 1,
};

/**
 * Interpolate a feature width based on the zoom level of map
 * Adapted from Mapbox GL JS linear interpolation using a formula linked below
 * https://github.com/mapbox/mapbox-gl-js/blob/d66ff288e7ab2e917e9e676bee942dd6a46171e7/src/style-spec/expression/definitions/interpolate.js
 * https://matthew-brett.github.io/teaching/linear_interpolation.html
 * @param {number} currentZoom - Current zoom level from the map
 * @param {number} minZoom - Minimum zoom level from the current bracket
 * @param {number} maxZoom - Maximum zoom level from the current bracket
 * @param {number} minPixelWidth - Minimum pixel width from the current bracket
 * @param {number} maxPixelWidth - Maximum pixel width from the current bracket
 * @return {number} Interpolated pixel width
 */
function linearInterpolation(
  currentZoom,
  minZoom,
  maxZoom,
  minPixelWidth,
  maxPixelWidth
) {
  return (
    ((currentZoom - minZoom) * (maxPixelWidth - minPixelWidth)) /
      (maxZoom - minZoom) +
    minPixelWidth
  );
}

/**
 * Calculate the circle radius using the circle radius steps in mapStyles and the map zoom level
 * @param {number} currentZoom - Current zoom level from the map
 * @return {number} Circle radius in pixels
 */
const getCircleRadiusByZoom = currentZoom => {
  const { stops } = mapStyles.circleRadiusStops;
  const [bottomZoom, bottomPixelWidth] = stops[0];
  const [topZoom, topPixelWidth] = stops[stops.length - 1];

  // Loop through the [zoom, radius in pixel] nested arrays in mapStyles.circleRadiusStops
  // to find which two elements the current zoom level falls between
  for (let i = 0; i < stops.length - 1; i++) {
    const [minZoom, minPixelWidth] = stops[i];
    const [maxZoom, maxPixelWidth] = stops[i + 1];

    // If current zoom is less than zoom in the first element
    if (currentZoom < bottomZoom) {
      return bottomPixelWidth;
    }

    // If current zoom is greater than zoom in the last element
    if (currentZoom >= topZoom) {
      return topPixelWidth;
    }

    // If the current zoom falls somewhere between
    if (currentZoom >= minZoom && currentZoom < maxZoom) {
      return linearInterpolation(
        currentZoom,
        minZoom,
        maxZoom,
        minPixelWidth,
        maxPixelWidth
      );
    }
  }
};

// https://github.com/uber/nebula.gl/tree/master/modules/react-map-gl-draw#styling-related-options
/**
 * Style a feature based on feature type and draw render state
 * @param {object} featureStyle - Contains data about feature render state and type (shape)
 * @param {object} featureStyle.feature - A GeoJSON feature
 * @param {string} featureStyle.state - String describing the render state of a drawn feature (SELECTED or HOVERED)
 * @return {object} React style object applied to a feature
 */
export function getFeatureStyle({ feature, state, currentZoom }) {
  const type = feature.properties.shape || feature.geometry.type;
  let style = null;

  const CIRCLE_RADIUS = getCircleRadiusByZoom(currentZoom);

  switch (state) {
    case RENDER_STATE.SELECTED:
      style = { ...SELECTED_STYLE };
      break;

    case RENDER_STATE.HOVERED:
      style = { ...HOVERED_STYLE };
      break;

    default:
      style = { ...DEFAULT_STYLE };
  }

  switch (type) {
    case SHAPE.POINT:
      style.r = CIRCLE_RADIUS;
      break;
    case SHAPE.LINE_STRING:
      style.fillOpacity = 0;
      break;
    default:
  }

  return style;
}

/**
 * Retrieve a list of features that were drawn using the UI exposed from useMapDrawTools
 * @param {object} featureCollection - GeoJSON feature collection containing project extent
 * @return {array} List of features that originated from the draw UI
 */
const getDrawnFeaturesFromFeatureCollection = featureCollection =>
  featureCollection.features.filter(feature =>
    drawnLayerNames.includes(feature.properties.sourceLayer)
  );

/**
 * Return the difference between two arrays of GeoJSON objects
 * @param {string} featureProperty- GeoJSON property key used to compare arrays of GeoJSON features
 * @param {array}  arrayOne - The first array of GeoJSON features
 * @param {array}  arrayTwo - The second array of GeoJSON features
 * @return {array} List of features that are different
 */
const findDifferenceByFeatureProperty = (featureProperty, arrayOne, arrayTwo) =>
  arrayOne.filter(
    arrayOneFeature =>
      !arrayTwo.some(
        arrayTwoFeature =>
          arrayOneFeature.properties[featureProperty] ===
          arrayTwoFeature.properties[featureProperty]
      )
  );

/**
 * Custom hook that builds draw tools and is used to enable or disable them
 * @param {object} featureCollection - GeoJSON feature collection to store drawn points within
 * @param {function} setFeatureCollection - Setter for GeoJSON feature collection state
 * @param {string} projectId - ID of the project associated with the extent being edited
 * @param {function} refetchProjectDetails - Called to update the props passed to the edit maps and show up-to-date features
 * @param {number} currentZoom - Current zoom level of the map
 * @return {UseMapDrawToolsObject} Object that exposes a function to render draw tools and setter/getter for isDrawing state
 */
/**
 * @typedef {object} UseLayerObject
 * @property {boolean} isDrawing - Are draw tools enabled or disabled
 * @property {function} setIsDrawing - Toggle draw tools
 * @property {function} renderMapDrawTools - Function that returns JSX for the draw tools in the map
 * @property {function} saveDrawnPoints - Function that saves features drawn in the UI
 */
export function useMapDrawTools(
  featureCollection,
  setFeatureCollection,
  projectId,
  refetchProjectDetails,
  currentZoom
) {
  const isNewProject = projectId === null;

  const mapEditorRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [modeId, setModeId] = useState(null);
  const [modeHandler, setModeHandler] = useState(null);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null);
  const [selectedEditHandleIndexes, setSelectedEditHandleIndexes] = useState(
    []
  );

  /**
   * Add existing drawn points in the project extent feature collection to the draw UI so they are editable
   */
  const initializeExistingDrawFeatures = useCallback(
    ref => {
      if (ref) {
        // Only add features that are not already present in the draw UI to avoid duplicates
        const drawnFeatures = getDrawnFeaturesFromFeatureCollection(
          featureCollection
        );
        const featuresAlreadyInDrawMap = ref.getFeatures();

        const featuresToAdd = findDifferenceByFeatureProperty(
          "PROJECT_EXTENT_ID",
          drawnFeatures,
          featuresAlreadyInDrawMap
        );

        ref.addFeatures(featuresToAdd);
      }
    },
    [featureCollection]
  );

  const [updateProjectExtent] = useMutation(UPSERT_PROJECT_EXTENT);

  /**
   * Updates state and mutates additions and deletions of points drawn with the UI
   */
  const saveDrawnPoints = () => {
    const drawnFeatures = mapEditorRef.current
      ? mapEditorRef.current.getFeatures()
      : [];

    // Track existing drawn features so that we don't duplicate them on each save
    const newDrawnFeatures = drawnFeatures.filter(
      feature => !drawnLayerNames.includes(feature?.properties?.sourceLayer)
    );

    // Add a UUID and layer name to the new features for retrieval and styling
    const drawnFeaturesWithSourceAndId = newDrawnFeatures.map(feature => {
      const featureUUID = uuidv4();

      return {
        ...feature,
        id: featureUUID,
        properties: {
          ...feature.properties,
          renderType: feature.geometry.type,
          PROJECT_EXTENT_ID: featureUUID,
          sourceLayer:
            feature.geometry.type === "LineString"
              ? "drawnByUserLine"
              : "drawnByUser",
        },
      };
    });

    // If this is a new project, update state. If it exists, mutate existing project data
    if (isNewProject) {
      // Update existing featureCollection with new drawn features so they can be inserted in NewProjectView
      const updatedFeatureCollection = {
        ...featureCollection,
        features: [
          ...featureCollection.features,
          ...drawnFeaturesWithSourceAndId,
        ],
      };

      setFeatureCollection(updatedFeatureCollection);
    } else if (!isNewProject) {
      // Create feature records for upsert
      const drawnFeatureRecords = drawnFeaturesWithSourceAndId.map(feature => ({
        location: feature,
        project_id: projectId,
        status_id: 1,
      }));

      // Upsert project feature records and refetch data
      updateProjectExtent({
        variables: {
          upserts: drawnFeatureRecords,
        },
      }).then(() => {
        refetchProjectDetails();
      });
    }

    // Close UI for user
    setIsDrawing(false);
  };

  /**
   * Takes the click event and sets the draw mode handler and selected mode ID
   * @param {object} e - A click event from a draw toolbar button
   */
  const switchMode = e => {
    const switchModeId = e.target.id === modeId ? null : e.target.id;
    const mode = MODES.find(m => m.id === switchModeId);
    const currentModeHandler = mode && mode.handler ? new mode.handler() : null;

    setModeId(switchModeId);
    setModeHandler(currentModeHandler);
  };

  /**
   * Takes a selected object and sets data about it in state
   * https://github.com/uber/nebula.gl/tree/master/modules/react-map-gl-draw#options
   * @param {object} selected - Holds data about the selected feature
   */
  const onSelect = selected => {
    setSelectedFeatureIndex(selected && selected.selectedFeatureIndex);
    setSelectedEditHandleIndexes(
      selected && selected.selectedEditHandleIndexes
    );
  };

  /**
   * Finds the currently selected feature and removes it from the drawn features array and featureCollection state
   */
  const onDelete = () => {
    const currentFeatures = mapEditorRef.current.getFeatures();
    // Remove the feature from the draw UI feature list
    if (selectedEditHandleIndexes.length) {
      try {
        mapEditorRef.current.deleteHandles(
          selectedFeatureIndex,
          selectedEditHandleIndexes
        );
      } catch (error) {
        console.log(error.message);
      }
      return;
    }

    if (selectedFeatureIndex === null || selectedFeatureIndex === undefined) {
      return;
    }

    mapEditorRef.current.deleteFeatures(selectedFeatureIndex);

    // Then, remove the feature from the feature collection of the project extent
    const featureToDelete = currentFeatures[selectedFeatureIndex];
    const featureIdGetPath = "properties.PROJECT_EXTENT_ID";
    const featureIdToDelete = get(featureToDelete, featureIdGetPath);

    const updatedFeatureCollection = {
      ...featureCollection,
      features: [
        ...featureCollection.features.filter(
          feature => get(feature, featureIdGetPath) !== featureIdToDelete
        ),
      ],
    };

    setFeatureCollection(updatedFeatureCollection);

    // Update modeId to momentarily change the background color of the delete icon on click
    const previousMode = modeId;
    setModeId("delete");
    setTimeout(() => setModeId(previousMode), 500);
  };

  /**
   * Renders the toolbar and buttons that control the map draw UI
   * @return {JSX} The toolbar for the map draw UI
   */
  const renderDrawToolbar = () => {
    return (
      <MapDrawToolbar
        selectedModeId={modeId}
        onSwitchMode={switchMode}
        onDelete={onDelete}
      />
    );
  };

  /**
   * Renders the map editor and its toolbar
   * @return {JSX} The whole map draw UI
   */
  const renderMapDrawTools = () => (
    <>
      <Editor
        ref={ref => {
          initializeExistingDrawFeatures(ref);
          mapEditorRef.current = ref;
        }}
        featureStyle={featureStyleObj =>
          getFeatureStyle({ ...featureStyleObj, currentZoom })
        }
        onSelect={onSelect}
        clickRadius={12}
        mode={modeHandler}
      />
      {renderDrawToolbar()}
    </>
  );

  return { isDrawing, setIsDrawing, renderMapDrawTools, saveDrawnPoints };
}
