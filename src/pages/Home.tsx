// Libraries
import { useState, useEffect } from "react";

// Components
import Main from '../components/Main';
import { CountyStatus, StateStatus, USStatus } from '../components/Status';
import { QueryMenu } from "../components/Query";
import Map from "../components/Map";
import * as Tooltip from "../components/Tooltip";

// Data 
import { selectVariable, defaultCounty, defaultState, defaultMap } from "../utils/Global";

// Data Management
import { getAdjacentTracts } from "../utils/DM";

// Types
import { GeoID } from "../utils/Types";

export default function Home({}): JSX.Element {

    const [selectedState, setSelectedState] = useState(defaultState);
    const [selectedCounty, setSelectedCounty] = useState(defaultCounty);
    const [adjTracts, setAdjTracts] = useState({type: 'FeatureCollection', 
                                                features: [] as GeoJSON.Feature[]} as GeoJSON.FeatureCollection);
    const [changeYear, setChangeYear] = useState(selectVariable.changeYear[0]);
    const [equityIndicator, setEquityIndicator] = useState(selectVariable.equityIndicator[0]);
    const [indicator, setIndicator] = useState(selectVariable.indicator[0]);
    const [showPolls, setShowPolls] = useState(true);
    const [showVD, setShowVD] = useState(false);
    const [isFullScreen, setFullScreen] = useState(true);
    const [geoJsonId, setGeoJsonId] = useState<GeoID>(defaultMap);

    useEffect(() => {
        Tooltip.init();
    }, []);

    useEffect(() => {
        setAdjTracts(getAdjacentTracts(selectedCounty));
    }, [selectedCounty]);

    return(
        <Main>
            {selectedState.stfp === ''? 
                <USStatus /> : 
                <>
                {selectedCounty.cntyfp === "" ? (
                        <StateStatus
                            equityIndicator={equityIndicator}
                            setEquityIndicator={setEquityIndicator}
                        />
                ) : (
                        <CountyStatus
                            equityIndicator={equityIndicator}
                            setEquityIndicator={setEquityIndicator}
                            showPolls={showPolls}
                            setShowPolls={setShowPolls}
                            showVD={showVD}
                            setShowVD={setShowVD}
                        />
                )}
                </>
            }
            <QueryMenu isFullScreen={isFullScreen} indicator={indicator} setIndicator={setIndicator} changeYear={changeYear} setChangeYear={setChangeYear} selectedState={selectedState} setSelectedState={setSelectedState} selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty}/>
            <Map setFullScreen={setFullScreen} selectedState={selectedState} setSelectedState={setSelectedState} 
                                               selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty} 
                                               showPolls={showPolls} setShowPolls={setShowPolls}
                                               showVD={showVD} setShowVD={setShowVD}/>
        </Main>
    )
}
