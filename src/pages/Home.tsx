// Libraries
import { useState, useEffect } from "react";

// Components
import Main from '../components/Main';
import { StateStatus, USStatus } from '../components/Status';
import { QueryMenu } from "../components/Query";
import Map from "../components/Map";
import { formattedStateGeoJSON } from "../utils/DM";
import * as Tooltip from "../components/Tooltip";

// Data 
import { selectVariable, defaultCounty, defaultState } from "../utils/Global";

// Data Management
const usData = formattedStateGeoJSON();

export default function Home({}): JSX.Element {

    const [selectedState, setSelectedState] = useState(defaultState);
    const [county, setCounty] = useState(defaultCounty);
    const [changeYear, setChangeYear] = useState(selectVariable.changeYear[0]);
    const [equityIndicator, setEquityIndicator] = useState(selectVariable.equityIndicator[0]);
    const [indicator, setIndicator] = useState(selectVariable.indicator[0]);
    const [isFullScreen, setFullScreen] = useState(true);

    console.log(selectedState);

    // console.log(bounds);

    const handleFullScreen = () => {
        // if (isFullScreen) {
        // } else {
        // }
        setFullScreen(!isFullScreen);
    };

    useEffect(() => {
        Tooltip.init();
    }, [])

    return(
        <Main>
            {isFullScreen? <USStatus /> : <StateStatus equityIndicator={equityIndicator} setEquityIndicator={setEquityIndicator} />}
            <QueryMenu usData={usData} isFullScreen={isFullScreen} indicator={indicator} setIndicator={setIndicator} changeYear={changeYear} setChangeYear={setChangeYear} selectedState={selectedState} setSelectedState={setSelectedState} county={county} setCounty={setCounty}/>
            <Map usData={usData} isFullScreen={isFullScreen} setFullScreen={setFullScreen} selectedState={selectedState} setSelectedState={setSelectedState} setCounty={setCounty}/>
        </Main>
    )
}
