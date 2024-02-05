// Libraries
import { useState, useEffect } from "react";

// Components
import Main from '../components/Main';
import { CountyStatus, StateStatus, USStatus } from '../components/Status';
import { QueryMenu } from "../components/Query";
import Map from "../components/Map";
import * as Tooltip from "../components/Tooltip";

import { ChangeYear } from "../utils/Types";

// Data 
import { selectVariable, defaultCounty, defaultState, defaultMap } from "../utils/Global";
import { getPollingLocsData, getCounties, getTracts, getVd, getStates } from "../utils/DM";

// Types
import { GeoID, PollingLoc } from "../utils/Types";

const statesURL = 'https://raw.githubusercontent.com/holmesjoli/equitable-polling/main/src/data/processed/statesGeoJSON.json';
const pollingLocsURL = 'https://raw.githubusercontent.com/holmesjoli/equitable-polling/main/src/data/processed/pollsChangeStatus.json';
const countiesLongURL = 'https://raw.githubusercontent.com/holmesjoli/equitable-polling/main/src/data/processed/countiesLongitudinal.json';
const countiesGeoURL = 'https://raw.githubusercontent.com/holmesjoli/equitable-polling/main/src/data/processed/countiesGeoJSON.json';
const tractsLongURL = 'https://raw.githubusercontent.com/holmesjoli/equitable-polling/main/src/data/processed/tractsLongitudinal.json';
const tractsGeoURL = 'https://raw.githubusercontent.com/holmesjoli/equitable-polling/main/src/data/processed/tractsGeoJSON.json';
const vdGeoURL = 'https://raw.githubusercontent.com/holmesjoli/equitable-polling/main/src/data/processed/votingDistrictsGeoJSON.json';

export default function Home({}): JSX.Element {

    const [selectedState, setSelectedState] = useState(defaultState);
    const [selectedCounty, setSelectedCounty] = useState(defaultCounty);
    const [changeYearOpts, setChangeYearOpts] = useState<ChangeYear[]>(selectVariable.changeYear);
    const [changeYear, setChangeYear] = useState(changeYearOpts[0]);
    const [equityIndicator, setEquityIndicator] = useState(selectVariable.equityIndicator[0]);
    const [indicator, setIndicator] = useState(selectVariable.indicator[0]);
    const [showPolls, setShowPolls] = useState(true);
    const [showVD, setShowVD] = useState(false);
    const [isFullScreen, setFullScreen] = useState(true);
    const [geoJsonId, setGeoJsonId] = useState<GeoID>(defaultMap);
    const [pollHover, setPollHover] = useState({});
    const [geoHover, setGeoHover] = useState({});

    const [loadedStateData, setLoadedStateData] = useState<boolean>(false);
    const [loadedCountyData, setLoadedCountyData] = useState<boolean>(false);
    const [loadedTractData, setLoadedTractData] = useState<boolean>(false);
    const [loadedVdData, setLoadedVdData] = useState<boolean>(false);
    const [decennialCensusYear, setDecennialCensusYear] = useState<number>(changeYear.decennialCensusYear);

    // Set data
    const [pollingLocsData, setPollingData] = useState<PollingLoc[]>([]);
    const [countiesLongData, setCountiesLongData] = useState<any[]>([]);
    const [countiesData, setCountiesData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);
    const [tractsLongData, setTractsLongData] = useState<any[]>([]);
    const [tractsData, setTractsData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);
    const [vdData, setVdData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);
    const [statesData, setStateData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);

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

    const fetchCountiesData = async () => {
        fetch(countiesGeoURL, {method: 'GET'})
             .then(res => res.json())
             .then((data: any) => setCountiesData(getCounties(data, countiesLongData)))
             .finally(() => setLoadedCountyData(true))
    };

    const fetchStatesData = async () => {
        fetch(statesURL, {method: 'GET'})
             .then(res => res.json())
             .then((data: any) => setStateData(getStates(data)))
             .finally(() => setLoadedStateData(true))
    };

    const fetchTractsLongData = async () => {
        fetch(tractsLongURL, {method: 'GET'})
             .then(res => res.json())
             .then((data: any) => setTractsLongData(data.filter((d: any) => d.baseYear === changeYear.baseYear)))
    };

    const fetchTractsData = async () => {
        fetch(tractsGeoURL, {method: 'GET'})
             .then(res => res.json())
             .then((data: any) => setTractsData(getTracts(data, tractsLongData, decennialCensusYear)))
             .finally(() => setLoadedTractData(true))
    };

    const fetchVdData = async () => {
        fetch(vdGeoURL, {method: 'GET'})
             .then(res => res.json())
             .then((data: any) => setVdData(getVd(data)))
             .finally(() => setLoadedVdData(true))
    };

    // React Hooks --------------------------------------------------------------------------
    useEffect(()=>{
        Tooltip.init();
    }, []);

    fetchStatesData();

    useEffect(() => {
        if (changeYear.baseYear < 2020) {
            setDecennialCensusYear(2010);
        } else {
            setDecennialCensusYear(2020);
        }
    }, [changeYear]);

    useEffect(()=>{

        if (geoJsonId.type === 'State') {
            fetchCountiesLongData();
        } else if (geoJsonId.type === 'County') {
            fetchTractsLongData();
            fetchPollingData();
            fetchVdData();
        }

       }, [changeYear, geoJsonId]);

    useEffect(()=>{

        if (geoJsonId.type === 'State') {
            fetchCountiesData();
        } else if (geoJsonId.type === 'County') {
            fetchTractsData();
        }

    }, [countiesLongData, tractsLongData, decennialCensusYear, geoJsonId]);

    useEffect(()=>{
        if (selectedState.abbr !== '') {
            const opts = selectVariable.changeYear.filter((d: any) => d[selectedState.abbr]);
            setChangeYearOpts(opts);
            setChangeYear(opts[0]);
        }
    }, [selectedState]);

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
            { loadedStateData ? 
            <>
            <QueryMenu geoJsonId={geoJsonId} setGeoJsonId={setGeoJsonId}  
                       changeYear={changeYear} setChangeYear={setChangeYear} 
                       changeYearOpts={changeYearOpts}
                       statesData={statesData} selectedState={selectedState} setSelectedState={setSelectedState} 
                       countiesData={countiesData} selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty} />
            <Map geoJsonId={geoJsonId} setGeoJsonId={setGeoJsonId} 
                selectedState={selectedState} setSelectedState={setSelectedState} 
                selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty} 
                showPolls={showPolls} setShowPolls={setShowPolls} showVD={showVD} setShowVD={setShowVD}
                setPollHover={setPollHover} changeYear={changeYear} equityIndicator={equityIndicator} 
                setGeoHover={setGeoHover} 
                pollingLocsData={pollingLocsData} countiesData={countiesData} tractsData={tractsData}
                vdData={vdData} statesData={statesData}
                loadedCountyData={loadedCountyData} loadedTractData={loadedTractData} loadedVdData={loadedVdData} 
                setCountiesData={setCountiesData}/>
                </>: null
            }
        </Main>
    )
}
