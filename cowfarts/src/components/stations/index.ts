import Helm from "./helm/Helm";
import Map from "./map/MapStation";
import Radar from "./radar/Radar";
import Sonar from "./sonar/Sonar";
import Weapons from "./weapons/Weapons";

import { GameConnection } from "../../game";
import { VesselUpdate } from "../../__protogen__/mass/api/updates_pb";
import { Engines } from "../../engines/engine";

export type StationProps = {
  game: GameConnection;
  engines: Engines;
  latestUpdate: VesselUpdate.AsObject;
};

export type StationComponent = React.FunctionComponent<StationProps>;

export enum Station {
  HELM = "helm",
  MAP = "map",
  RADAR = "radar",
  SONAR = "sonar",
  WEAPONS = "weapons",
}

export const stationMapping: { [key in Station]: StationComponent } = {
  [Station.HELM]: Helm,
  [Station.MAP]: Map,
  [Station.RADAR]: Radar,
  [Station.SONAR]: Sonar,
  [Station.WEAPONS]: Weapons,
};
