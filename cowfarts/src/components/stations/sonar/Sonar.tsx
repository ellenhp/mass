import React, { useState } from "react";
import { StationComponent, StationProps } from "..";
//import Waterfall from "./ElemSingletonMount";
import "./Sonar.css";
import BroadbandSwitcher from "./BroadbandSwitcher";
import ContactManager from "./ContactManager";
import { getContacts } from "../../../gettorz";
import NarrowbandWaterfall from "./NarrowbandWaterfall";
import NarrowbandBay from "./NarrowbandBay";

const Sonar: StationComponent = (props: StationProps) => {
  const [selectedContacts, setSelectedContacts] = useState(
    getContacts(props.latestUpdate).map((contact) => contact.designation)
  );

  return (
    <div className="sonar-station">
      <div className="broadband-bay-1 card">
        <BroadbandSwitcher
          engine={props.engines.sonarEngine}
          defaultTerm={"short"}
          selectedContacts={selectedContacts}
          game={props.game}
          latestUpdate={props.latestUpdate}
        />
      </div>
      <div className="broadband-bay-2 card">
        <BroadbandSwitcher
          engine={props.engines.sonarEngine}
          defaultTerm={"medium"}
          selectedContacts={selectedContacts}
          game={props.game}
          latestUpdate={props.latestUpdate}
        />
      </div>
      <NarrowbandBay engines={props.engines} />
      <ContactManager
        game={props.game}
        latestUpdate={props.latestUpdate}
        selectedContacts={selectedContacts}
        setSelectedContacts={setSelectedContacts}
      />
    </div>
  );
};

export default Sonar;
