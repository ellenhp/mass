import {
  DoActionRequest,
  PropulsionSystemRequest,
  SystemRequest,
  SteeringSystemRequest,
  HullSystemRequest,
  DivingSystemRequest,
  TmaSystemRequest,
  WeaponSystemRequest,
} from "./__protogen__/mass/api/actions_pb";
import { GameConnection } from "./game";
import { Weapon } from "./__protogen__/mass/api/weapons_pb";

export function requestSpeed(game, speed: number) {
  const speedSystemsRequest = new PropulsionSystemRequest();
  speedSystemsRequest.setSpeedKnots(speed);
  const systemsRequest = new SystemRequest();
  systemsRequest.setPropulsionRequest(speedSystemsRequest);

  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList([systemsRequest]);

  game.performAction(doActionRequest);
}

export function requestHeading(game: GameConnection, heading: number) {
  if (heading < 0 || heading >= 360) {
    throw `${heading} IS NOT A VALID HEADING`;
  }

  const steeringSystemRequest = new SteeringSystemRequest();
  steeringSystemRequest.setHeadingDegrees(heading);
  const systemsRequest = new SystemRequest();
  systemsRequest.setSteeringRequest(steeringSystemRequest);

  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList([systemsRequest]);

  game.performAction(doActionRequest);
}

export function requestDepth(game: GameConnection, depth: number) {
  if (depth < 0) {
    throw `${depth} IS NOT A VALID DEPTH`;
  }

  const divingSystemRequest = new DivingSystemRequest();
  divingSystemRequest.setDepthFeet(depth);
  const systemsRequest = new SystemRequest();
  systemsRequest.setDivingRequest(divingSystemRequest);

  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList([systemsRequest]);

  game.performAction(doActionRequest);
}

export function createContact(game: GameConnection) {
  const addContactRequest = new TmaSystemRequest.TmaAddContactSubrequest();

  const tmaSystemRequest = new TmaSystemRequest();
  tmaSystemRequest.setAddContactRequest(addContactRequest);
  const systemsRequest = new SystemRequest();
  systemsRequest.setTmaRequest(tmaSystemRequest);

  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList([systemsRequest]);

  game.performAction(doActionRequest);
}

export function deleteContactList(game: GameConnection, contacts: string[]) {
  const requests = contacts.map((contact) => {
    const deleteContactRequest = new TmaSystemRequest.TmaDeleteContactSubrequest();
    deleteContactRequest.setDesignation(contact);

    const tmaSystemRequest = new TmaSystemRequest();
    tmaSystemRequest.setDeleteContactRequest(deleteContactRequest);
    const systemsRequest = new SystemRequest();
    systemsRequest.setTmaRequest(tmaSystemRequest);
    return systemsRequest;
  });

  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList(requests);

  game.performAction(doActionRequest);
}

export function mergeContacts(game: GameConnection, contacts: string[]) {
  const mergeContactRequest = new TmaSystemRequest.TmaMergeContactSubrequest();
  mergeContactRequest.setDesignationsList(contacts);

  const tmaSystemRequest = new TmaSystemRequest();
  tmaSystemRequest.setMergeContactRequest(mergeContactRequest);
  const systemsRequest = new SystemRequest();
  systemsRequest.setTmaRequest(tmaSystemRequest);
  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList([systemsRequest]);

  game.performAction(doActionRequest);
}

export function takeBearingForContact(
  game: GameConnection,
  bearing: number,
  contact: string
) {
  if (bearing < 0 || bearing >= 360) {
    throw `${bearing} IS NOT A VALID BEARING`;
  }
  const takeBearingRequest = new TmaSystemRequest.TmaTakeBearingSubrequest();
  takeBearingRequest.setBearingDegrees(Math.floor(bearing));
  takeBearingRequest.setDesignation(contact);

  const tmaSystemRequest = new TmaSystemRequest();
  tmaSystemRequest.setTakeBearingRequest(takeBearingRequest);
  const systemsRequest = new SystemRequest();
  systemsRequest.setTmaRequest(tmaSystemRequest);
  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList([systemsRequest]);

  game.performAction(doActionRequest);
}

export function fireTorpedo(
  game: GameConnection,
  heading: number,
  speedKts: number,
  enableDistanceFeet: number
) {
  const adcapWeapon = new Weapon();
  adcapWeapon.setWeaponVesselDescriptor("adcap");

  const fireRequest = new WeaponSystemRequest.FireWeaponRequest();

  fireRequest.setWeapon(adcapWeapon);
  fireRequest.setEnableDistanceFeet(enableDistanceFeet);
  fireRequest.setGuidanceMode(
    WeaponSystemRequest.FireWeaponRequest.GuidanceMode.ACTIVE
  );
  fireRequest.setSpeedKnots(speedKts);
  fireRequest.setHeadingDegrees(heading);
  const weaponSystemRequest = new WeaponSystemRequest();
  weaponSystemRequest.setFireWeaponRequest(fireRequest);

  const systemsRequest = new SystemRequest();
  systemsRequest.setWeaponRequest(weaponSystemRequest);
  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList([systemsRequest]);

  game.performAction(doActionRequest);
}

export function fireDecoy(game: GameConnection) {
  const decoyWeapon = new Weapon();
  decoyWeapon.setWeaponVesselDescriptor("decoy");

  const fireRequest = new WeaponSystemRequest.FireWeaponRequest();
  fireRequest.setWeapon(decoyWeapon);
  const weaponSystemRequest = new WeaponSystemRequest();
  weaponSystemRequest.setFireWeaponRequest(fireRequest);

  const systemsRequest = new SystemRequest();
  systemsRequest.setWeaponRequest(weaponSystemRequest);
  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList([systemsRequest]);

  game.performAction(doActionRequest);
}

export function fireNoisemaker(game: GameConnection) {
  const noisemakerWeapon = new Weapon();
  noisemakerWeapon.setWeaponVesselDescriptor("noisemaker");

  const fireRequest = new WeaponSystemRequest.FireWeaponRequest();
  fireRequest.setWeapon(noisemakerWeapon);
  const weaponSystemRequest = new WeaponSystemRequest();
  weaponSystemRequest.setFireWeaponRequest(fireRequest);

  const systemsRequest = new SystemRequest();
  systemsRequest.setWeaponRequest(weaponSystemRequest);
  const doActionRequest = new DoActionRequest();
  doActionRequest.setScenarioId(game.scenarioId);
  doActionRequest.setVesselId(game.vesselId);
  doActionRequest.setSystemRequestsList([systemsRequest]);

  game.performAction(doActionRequest);
}
