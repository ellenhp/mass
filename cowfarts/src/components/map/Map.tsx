import React, { useState } from "react";
import "./Map.css";
import { VesselUpdate } from "../../__protogen__/mass/api/updates_pb";
import {
  Viewport,
  localToGlobal,
  changeZoom,
  latLongToMapTL,
  paneTransform,
} from "./helpers";
import MapEngine from "../../engines/mapEngine/mapEngine";
import { MAP_EL_ID, MAP_VIEWPORT_ID, MAP_OVERLAY_ID } from "./constants";
import { MapTool } from "./tools";
import PanTool from "./tools/panTool";
import { LatLong } from "../../commonTypes";
import { MapData } from "../../engines/mapEngine/data";

interface MapProps {
  className?: string;
  mapEngine: MapEngine;
  latestUpdate: VesselUpdate.AsObject;
}

// TODO: We really should compress this proto on entry
// and replace VesselUpdate.AsObject as the canonical world update.
const getPlayerHeading = (latestUpdate: VesselUpdate.AsObject) => {
  return latestUpdate.systemUpdatesList.filter(
    (system) => system.steeringUpdate
  )[0].steeringUpdate.actualHeadingDegrees;
};

/* This is a lot */
const getViewportWithPlayerInCenter = (
  viewport: Viewport,
  position: LatLong,
  data: MapData
) => {
  const pos = latLongToMapTL(position, data);
  return {
    x: pos.left,
    y: pos.top,
    zoom: viewport.zoom,
  };
};

const tools = {
  pan: new PanTool(),
};

const Map = ({ className, mapEngine, latestUpdate }: MapProps) => {
  // Thank god that this is just math
  const initialState = getViewportWithPlayerInCenter(
    {
      x: 0,
      y: 0,
      zoom: 1,
    },
    latestUpdate.position,
    mapEngine.data
  );
  let [viewport, setViewport] = useState<Viewport>(initialState);

  // Nasty hack to shim in staying centered on player. Is v. gross and
  // should be abstracted away. Viewport should not include zoom
  const [isCenteredOnPlayer, setCenteredOnPlayer] = useState<boolean>(true);
  if (isCenteredOnPlayer) {
    viewport = getViewportWithPlayerInCenter(
      viewport,
      latestUpdate.position,
      mapEngine.data
    );
  }

  const focusViewport = (viewport: Viewport) => {
    setViewport(viewport);
    setCenteredOnPlayer(false);
  };

  // End nasty hack

  const [tool] = useState<MapTool>(tools.pan);

  const zoomIn = () => {
    setViewport(changeZoom(1, viewport));
  };

  const zoomOut = () => {
    setViewport(changeZoom(-1, viewport));
  };

  const centerOnPlayer = () => {
    setCenteredOnPlayer(true);
  };

  const playerTL = localToGlobal(
    latLongToMapTL(latestUpdate.position, mapEngine.data),
    viewport
  );

  const playerIconStyle = {
    transform: `translate(${playerTL.left}px, ${
      playerTL.top
    }px) rotate(${getPlayerHeading(latestUpdate)}deg)`,
  };

  const mouseMove = (event: React.MouseEvent) =>
    tool.mouseMove && tool.mouseMove(event, viewport, focusViewport);
  const mouseUp = (event: React.MouseEvent) =>
    tool.mouseUp && tool.mouseUp(event, viewport, focusViewport);
  const mouseDown = (event: React.MouseEvent) =>
    tool.mouseDown && tool.mouseDown(event, viewport, focusViewport);
  const mouseLeave = (event: React.MouseEvent) =>
    tool.mouseLeave && tool.mouseLeave(event, viewport, focusViewport);

  return (
    <div
      className={"map-viewport " + className}
      onMouseMove={mouseMove}
      onMouseUp={mouseUp}
      onMouseDown={mouseDown}
      onMouseLeave={mouseLeave}
      id={MAP_VIEWPORT_ID}
    >
      <div className="map-viewport-center">
        <div
          className="map-pane"
          style={{ transform: paneTransform(viewport) }}
          id={MAP_EL_ID}
        >
          <img src={mapEngine.mapImageEl.src} />
        </div>
        <div className="map-overlay" id={MAP_OVERLAY_ID}>
          <div className="map-player-icon" style={playerIconStyle} />
        </div>
      </div>

      <div className="map-zoom-buttons">
        {!isCenteredOnPlayer && (
          <button onClick={centerOnPlayer}>Center on Player</button>
        )}
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div>
    </div>
  );
};

export default Map;
