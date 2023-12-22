// Libraries
import { useState } from "react";

// Components
import Main from '../components/Main';
import { StateStatus, USStatus } from '../components/Status';
import { QueryMenu } from "../components/Query";
import Map from "../components/Map";
import { formattedStateGeoJSON } from "../utils/DM";

// Data 
import { selectVariable, defaultCounty } from "../utils/Global";

//Types
import { State } from "../utils/Types";

// Globals
import { centerUS } from "../utils/Global";

// Data Management
const stateData = formattedStateGeoJSON();

export default function Home({}): JSX.Element {

    const [state, setState] = useState({'stname':'', 'stfp':'', 'counties': {} as GeoJSON.FeatureCollection, latlng: centerUS, zoom: 5} as State);
    const [county, setCounty] = useState(defaultCounty);
    const [changeYear, setChangeYear] = useState(selectVariable.changeYear[0]);
    const [equityIndicator, setEquityIndicator] = useState(selectVariable.equityIndicator[0]);
    const [indicator, setIndicator] = useState(selectVariable.indicator[0]);
    const [isFullScreen, setFullScreen] = useState(true);

    // console.log(bounds);

    const handleFullScreen = () => {
        // if (isFullScreen) {
        // } else {
        // }
        setFullScreen(!isFullScreen);
    };

    return(
        <Main>
            {isFullScreen? <USStatus /> : <StateStatus equityIndicator={equityIndicator} setEquityIndicator={setEquityIndicator} />}
            <QueryMenu stateData={stateData} isFullScreen={isFullScreen} indicator={indicator} setIndicator={setIndicator} changeYear={changeYear} setChangeYear={setChangeYear} state={state} setState={setState} county={county} setCounty={setCounty}/>
            <Map stateData={stateData} setFullScreen={setFullScreen} state={state} setState={setState} setCounty={setCounty}/>
        </Main>
    )
}
