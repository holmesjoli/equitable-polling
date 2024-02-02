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
import { getPollingLocsData, getCounties, getTracts } from "../utils/DM";

// Types
import { GeoID, PollingLoc } from "../utils/Types";

const pollingLocsURL = 'https://raw.githubusercontent.com/holmesjoli/equitable-polling/main/src/data/processed/pollsChangeStatus.json';
const countiesLongURL = 'https://raw.githubusercontent.com/holmesjoli/equitable-polling/main/src/data/processed/countiesLongitudinal.json';
const countiesGeoURL = 'https://raw.githubusercontent.com/holmesjoli/equitable-polling/main/src/data/processed/countiesGeoJSON.json';
const tractsLongURL = 'https://raw.githubusercontent.com/holmesjoli/equitable-polling/main/src/data/processed/tractsLongitudinal.json';
const tractsGeoURL = 'https://raw.githubusercontent.com/holmesjoli/equitable-polling/main/src/data/processed/tractsGeoJSON.json';

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

    const [loadedCountyData, setLoadedCountyData] = useState<boolean>(false);
    const [loadedTractData, setLoadedTractData] = useState<boolean>(false);
    const [decennialCensusYear, setDecennialCensusYear] = useState<number>(changeYear.decennialCensusYear);

    // Set data
    const [pollingLocsData, setPollingData] = useState<PollingLoc[]>([]);
    const [countiesLongData, setCountiesLongData] = useState<any[]>([]);
    const [countiesData, setCountiesData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);
    const [tractsLongData, setTractsLongData] = useState<any[]>([]);
    const [tractsData, setTractsData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);

    console.log(tractsData);

    useEffect(()=>{
        Tooltip.init();
    }, []);

    useEffect(() => {
        if (changeYear.baseYear < 2020) {
            setDecennialCensusYear(2010);
        } else {
            setDecennialCensusYear(2020);
        }
    }, [changeYear]);

    useEffect(()=>{
        const fetchPollingData = async () => {
            fetch(pollingLocsURL, {method: 'GET'})
                 .then(res => res.json())
                 .then((data: any) => setPollingData(getPollingLocsData(data, changeYear) as PollingLoc[]));
        };

        const fetchCountiesLongData = async () => {
            fetch(countiesLongURL, {method: 'GET'})
                 .then(res => res.json())
                 .then((data: any) => setCountiesLongData(data.filter((d: any) => d.baseYear === changeYear.baseYear)))
        };

        const fetchTractsLongData = async () => {
            fetch(tractsLongURL, {method: 'GET'})
                 .then(res => res.json())
                 .then((data: any) => setTractsLongData(data.filter((d: any) => d.baseYear === changeYear.baseYear)))
        };

        if (geoJsonId.type === 'State') {
            fetchCountiesLongData();
        } else if (geoJsonId.type === 'County') {
            fetchTractsLongData();
            fetchPollingData();
        }

       }, [changeYear, geoJsonId]);

       useEffect(()=>{
        const fetchCountiesData = async () => {
            fetch(countiesGeoURL, {method: 'GET'})
                 .then(res => res.json())
                 .then((data: any) => setCountiesData(getCounties(data, countiesLongData)))
                 .finally(() => setLoadedCountyData(true))
        };

        const fetchTractsData = async () => {
            fetch(tractsGeoURL, {method: 'GET'})
                 .then(res => res.json())
                 .then((data: any) => setTractsData(getTracts(data, tractsLongData, decennialCensusYear)))
                 .finally(() => setLoadedTractData(true))
        };

        if (geoJsonId.type === 'State') {
            fetchCountiesData();
        } else if (geoJsonId.type === 'County') {
            fetchTractsData();
        }

       }, [countiesLongData, tractsLongData, decennialCensusYear, geoJsonId]);

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
                setGeoHover={setGeoHover} 
                pollingLocsData={pollingLocsData} countiesData={countiesData} tractsData={tractsData}
                loadedCountyData={loadedCountyData} loadedTractData={loadedTractData}/>
        </Main>
    )
}
