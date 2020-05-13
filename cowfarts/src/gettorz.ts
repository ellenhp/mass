import { VesselUpdate } from "./__protogen__/mass/api/updates_pb";

export const getRequestedSpeed = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.propulsionUpdate)[0]
    .propulsionUpdate.requestedSpeedKnots;
};

export const getRequestedHeading = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.steeringUpdate)[0]
    .steeringUpdate.requestedHeadingDegrees;
};
