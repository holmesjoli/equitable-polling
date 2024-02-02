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
import { getPollingLocsData } from "../utils/DM";

// Types
import { GeoID, PollingLoc } from "../utils/Types";

const pollingLocsURL = 'https://raw.githubusercontent.com/holmesjoli/equitable-polling/main/src/data/processed/pollsChangeStatus.json';

export default function Home({}): JSX.Element {

    const [selectedState, setSelectedState] = useState(defaultState);
    const [selectedCounty, setSelectedCounty] = useState(defaultCounty);
    const [changeYear, setChangeYear] = useState(selectVariable.changeYear[0]);
    const [equityIndicator, setEquityIndicator] = useState(selectVariable.equityIndicator[0]);
    const [indicator, setIndicator] = useState(selectVariable.indicator[0]);
    const [showPolls, setShowPolls] = useState(true);
    const [showVD, setShowVD] = useState(false);
    const [isFullScreen, setFullScreen] = useState(true);
    const [geoJsonId, setGeoJsonId] = useState<GeoID>(defaultMap);

    const [pollHover, setPollHover] = useState({});
    const [geoHover, setGeoHover] = useState({});

    const [loading, setLoading] = useState<boolean>(true);

    // Set data
    const [pollingLocsData, setPollingData] = useState<PollingLoc[]>([]);

    console.log(pollingLocsData);

    useEffect(()=>{
        Tooltip.init();
    }, []);

    useEffect(()=>{
        const fetchPollingData = async () => {
            fetch(pollingLocsURL, {method: 'GET'})
                 .then(res => res.json())
                 .then((data: any) => setPollingData(getPollingLocsData(data, changeYear) as PollingLoc[]))
                 .finally(() => setLoading(false))
         };

         if (geoJsonId.type === 'County') {
            fetchPollingData();
         }
       }, [changeYear, geoJsonId]);

    return(
        <Main>
            {geoJsonId.type === 'US'? 
                <USStatus /> : 
                <>
                {geoJsonId.type === "State" ? (
                    <StateStatus
                        equityIndicator={equityIndicator}
                        setEquityIndicator={setEquityIndicator}
                        pollHover={pollHover}
                        geoHover={geoHover}
                        changeYear={changeYear}
                    />
                ) : (
                    <CountyStatus
                        equityIndicator={equityIndicator}
                        setEquityIndicator={setEquityIndicator}
                        showPolls={showPolls}
                        setShowPolls={setShowPolls}
                        showVD={showVD}
                        setShowVD={setShowVD}
                        pollHover={pollHover}
                        geoHover={geoHover}
                        changeYear={changeYear}
                    />
                )}
                </>
            }

            <QueryMenu geoJsonId={geoJsonId} changeYear={changeYear} setChangeYear={setChangeYear} 
                       selectedState={selectedState} setSelectedState={setSelectedState} 
                       selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty} 
                       setGeoJsonId={setGeoJsonId}/>
            <Map geoJsonId={geoJsonId} setGeoJsonId={setGeoJsonId} 
                selectedState={selectedState} setSelectedState={setSelectedState} 
                setSelectedCounty={setSelectedCounty} 
                showPolls={showPolls} setShowPolls={setShowPolls} showVD={showVD} setShowVD={setShowVD}
                setPollHover={setPollHover} changeYear={changeYear} equityIndicator={equityIndicator} 
                setGeoHover={setGeoHover} pollingLocsData={pollingLocsData}/>
        </Main>
    )
}
