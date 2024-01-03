// Libraries
import { useState, useEffect } from "react";

// Components
import Main from '../components/Main';
import { StateStatus, USStatus } from '../components/Status';
import { QueryMenu } from "../components/Query";
import Map from "../components/Map";
import * as Tooltip from "../components/Tooltip";

// Data 
import { selectVariable, defaultCounty, defaultState } from "../utils/Global";

// Data Management
import { getAdjacentTracts } from "../utils/DM";

export default function Home({}): JSX.Element {

    const [selectedState, setSelectedState] = useState(defaultState);
    const [selectedCounty, setSelectedCounty] = useState(defaultCounty);
    const [adjTracts, setAdjTracts] = useState({type: 'FeatureCollection', 
                                                features: [] as GeoJSON.Feature[]} as GeoJSON.FeatureCollection);
    const [changeYear, setChangeYear] = useState(selectVariable.changeYear[0]);
    const [equityIndicator, setEquityIndicator] = useState(selectVariable.equityIndicator[0]);
    const [indicator, setIndicator] = useState(selectVariable.indicator[0]);
    const [isFullScreen, setFullScreen] = useState(true);

    useEffect(() => {
        Tooltip.init();
    }, []);

    useEffect(() => {
        setAdjTracts(getAdjacentTracts(selectedCounty));
    }, [selectedCounty]);


    return(
        <Main>
            {isFullScreen? <USStatus /> : <StateStatus equityIndicator={equityIndicator} setEquityIndicator={setEquityIndicator} />}
            <QueryMenu isFullScreen={isFullScreen} indicator={indicator} setIndicator={setIndicator} changeYear={changeYear} setChangeYear={setChangeYear} selectedState={selectedState} setSelectedState={setSelectedState} selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty}/>
            <Map setFullScreen={setFullScreen} selectedState={selectedState} setSelectedState={setSelectedState} selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty} />
        </Main>
    )
}
