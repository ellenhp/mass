import { VesselUpdate } from "./__protogen__/mass/api/updates_pb";
import ContactManager from "./components/stations/sonar/ContactManager";

export const getRequestedSpeed = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.propulsionUpdate)[0]
    .propulsionUpdate.requestedSpeedKnots;
};

export const getActualSpeed = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.propulsionUpdate)[0]
    .propulsionUpdate.actualSpeedKnots;
};

export const getRequestedHeading = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.steeringUpdate)[0]
    .steeringUpdate.requestedHeadingDegrees;
};

export const getCurrentHeading = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.steeringUpdate)[0]
    .steeringUpdate.actualHeadingDegrees;
};

export const getRequestedDepth = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.divingUpdate)[0]
    .divingUpdate.requestedDepthFeet;
};

export const getCurrentDepth = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.hullUpdate)[0]
    .hullUpdate.actualDepthFeet;
};

export const getMeasuredFeetBelowKeel = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.sonarUpdate)[0]
    .sonarUpdate.depthBelowKeelFeet;
};

export const getContacts = (update: VesselUpdate.AsObject) => {
  return update.systemUpdatesList.filter((system) => system.tmaUpdate)[0]
    .tmaUpdate.contactsList;
};

export const getBearingsForContact = (
  update: VesselUpdate.AsObject,
  targetDesignation: string
) => {
  const bearingsForContact = update.systemUpdatesList
    .filter((system) => system.tmaUpdate)[0]
    .tmaUpdate.contactsList.filter(
      (contact) => contact.designation === targetDesignation
    )
    .map((contact) => {
      return contact.bearingsList || [];
    })
    .reduce((a, b) => a.concat(b), []);
  return bearingsForContact;
};

export const getWeaponCount = (
  update: VesselUpdate.AsObject,
  weaponId: string
) => {
  return update.systemUpdatesList
    .filter((system) => system.weaponUpdate)[0]
    .weaponUpdate.armamentList.filter(
      (armarment) => armarment.weapon.weaponVesselDescriptor === weaponId
    )[0].count;
};
