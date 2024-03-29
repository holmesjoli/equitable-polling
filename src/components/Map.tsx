// Libraries
import { useEffect, useMemo, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, Rectangle, FeatureGroup, Circle, Pane } from "react-leaflet";
import { point, bounds, PathOptions} from 'leaflet';

import * as d3 from 'd3';

// Components
import {mouseOverTextVD, mouseOverTextState, mouseOverTextTract, mouseOverTextPoll, 
        mouseOverTextPollSummary, pointerOver, pointerOut} from "./Tooltip";
        
// Types
import { State, County, GeoID, PollingLoc, ChangeYear, EquityIndicator } from "../utils/Types";

// Global
import { defaultMap, outerBounds, defaultCounty, defaultState } from "../utils/Global";
import { useStableCallback, returnCountyShouldInteract } from "../utils/Helper";

// Styles
import { layersStyle, highlightGeographicBoundary, vdStyle, choroplethStyle, pollStyle, pollSummarySize } from "../utils/Theme";

// Returns the bounds of the current map view
function getMapBounds(mapRef: any) {
    const mapBounds = mapRef.current.getBounds();
    const mapNE = mapBounds?.getNorthEast();
    const mapSW = mapBounds?.getSouthWest();

    return bounds(point(mapSW!.lat, mapSW!.lng), point(mapNE!.lat, mapNE!.lng));
}

// Returns a list of geographies which are current in view
function filterGeoByBounds(mapRef: any, data: any) {

    const mapBounds = getMapBounds(mapRef);                          

    const features: any[] = [];

    data.features.forEach((d: any) => {

        var p1 = point(d.properties.bounds.southWest.lat, d.properties.bounds.southWest.lng),
            p2 = point(d.properties.bounds.northEast.lat, d.properties.bounds.northEast.lng),
            tractBounds = bounds(p1, p2);

        if (mapBounds.intersects(tractBounds)) {
            features.push(d);
        }
    });

    return {type: 'FeatureCollection', features: features} as GeoJSON.FeatureCollection;
}

function filterPointByBounds(mapRef: any, data: any) {

    const mapBounds = getMapBounds(mapRef);

    const points: PollingLoc[] = [];

    data.forEach((d: any) => {
        const p = point(d.latlng.lat, d.latlng.lng);
        if (mapBounds.contains(p)) {
            d.pixelCoord = mapRef.current.latLngToLayerPoint(d.latlng);
            points.push(d);
        }
    });

    return points;
}

function partOfSelectedState(data: GeoJSON.FeatureCollection, geoid: string) {
    return data.features.map((d: GeoJSON.Feature) => {
        if (d.properties!.stfp === geoid) {
            return { ...d, properties: { ...d.properties, selected: true } };
        } else {
            return { ...d, properties: { ...d.properties, selected: false } };
        }
    });
}

function partOfSelectedCounty(data: GeoJSON.FeatureCollection, geoid: string) {
    return data.features.map((d: GeoJSON.Feature) => {
        if (d.properties!.cntyfp === geoid) {
            return { ...d, properties: { ...d.properties, selected: true } };
        } else {
            return { ...d, properties: { ...d.properties, selected: false } };
        }
    });
}

function LayersComponent({ mapRef, geoJsonId, setGeoJsonId, selectedState, setSelectedState, selectedCounty, setSelectedCounty, showPolls, 
                           setShowPolls, setPollHover, showVD, setShowVD, changeYear, equityIndicator, setGeoHover, 
                           pollingLocsData, statesData, countiesData, tractsData, vdData, loadedCountyData, loadedTractData, loadedVdData,
                           loadedPollingLocsData,
                           setStatesData, setCountiesData, setTractsData}: 
                        {  mapRef: any, geoJsonId: GeoID, setGeoJsonId: any, 
                           selectedState: State, setSelectedState: any, 
                           selectedCounty: any, setSelectedCounty: any, 
                           showPolls: boolean, setShowPolls: any, setPollHover: any, 
                           showVD: boolean, setShowVD: any, changeYear: ChangeYear, equityIndicator: EquityIndicator, 
                           setGeoHover: any, 
                           pollingLocsData: any, statesData: GeoJSON.FeatureCollection, countiesData: GeoJSON.FeatureCollection, tractsData: GeoJSON.FeatureCollection,
                           vdData: GeoJSON.FeatureCollection,
                           loadedCountyData: boolean, loadedTractData: boolean, loadedVdData: boolean, loadedPollingLocsData: boolean,
                           setStatesData: any, setCountiesData: any, setTractsData: any }) {

    const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);
    const [geoJsonBoundaryData, setGeoJsonBoundaryData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);
    const [geoJsonVdData, setGeoJsonVdData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);

    const [loadedGeoJsonData, setLoadedGeoJsonData] = useState<boolean>(false);
    const [loadedGeoJsonBoundaryData, setLoadedGeoJsonBoundaryData] = useState<boolean>(false);

    const [pollingLocsInBound, setPollingLocsInBound] = useState<any[]>([]);

    const rectRef = useRef<L.Rectangle>(null);
    const geoJsonRef = useRef<L.GeoJSON<any, any>>(null);
    const geoJsonBoundaryRef = useRef<L.GeoJSON<any, any>>(null);
    const geoJsonVdRef = useRef<L.GeoJSON<any, any>>(null);

    // Functions ---------------------------------------------------

    const stableMouseoutCallback = useStableCallback(mouseOut);
    const stableMouseoverCallback = useStableCallback(mouseOver);
    const stableOnClickCallback = useStableCallback(onClickFeature);
    const stableMouseoverPollSummaryCallback = useStableCallback(mouseOverPollSummary);

    function mouseOver(properties: any) {

        if (properties.type === "State") {
            return mouseOverState;
        } else if(properties.type === "County") {
            return mouseOverCounty;
        } else if(properties.type === "Tract") {
            return mouseOverTract;
        }
    }

    function mouseOverPollingLoc(d: any) {
        var coords = mapRef.current.latLngToContainerPoint(d.latlng);
        pointerOver(coords.x + 20, coords.y - 10, mouseOverTextPoll(d));
        setPollHover(d);
    }

    function mouseOverVD(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.VD.highlight);
        var coords = mapRef.current.latLngToContainerPoint(layer.feature.properties.latlng);
        pointerOver(coords.x + 20, coords.y - 10, mouseOverTextVD(layer.feature));
    }

    function mouseOverTract(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.Tract.highlight);
        var coords = mapRef.current.latLngToContainerPoint(layer.feature.properties.latlng);
        pointerOver(coords.x, coords.y, mouseOverTextTract(layer.feature, equityIndicator, changeYear));
        setGeoHover(layer.feature.properties);
    }

    function mouseOverCountyorPollSummary(feature: any) {

        var coords = mapRef.current.latLngToContainerPoint(feature.properties.latlng);
        pointerOver(coords.x + 30, coords.y - 10, mouseOverTextPollSummary(feature, equityIndicator, changeYear));
        setPollHover(feature.properties);
        setGeoHover(feature.properties);
    }

    function mouseOverCounty(event: any) {
        var layer = event.target;
        if (returnCountyShouldInteract(changeYear, layer.feature.properties)) {
            layer.setStyle(layersStyle.County.highlight);
            mouseOverCountyorPollSummary(layer.feature);
        }
    }

    function mouseOverPollSummary(feature: any) {
        mouseOverCountyorPollSummary(feature);
    }

    function mouseOverState(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.State.highlight);
        var coords = mapRef.current.latLngToContainerPoint(layer.feature.properties.latlng);
        pointerOver(coords.x, coords.y, mouseOverTextState(layer.feature));
    }

    function mouseOutPoll() {
        pointerOut();
        setPollHover({});
    }

    function mouseOut(event: any) {
        var layer = event.target;
        layer.setStyle(choroplethStyle(layer.feature, equityIndicator) as PathOptions);
        pointerOut();
        d3.select(".Status .ComponentGroupInner span").attr("class", "");
        setGeoHover({});
        setPollHover({});
    }

    function onEachFeature(_: any, layer: any) {

        const properties = layer.feature.properties;

        layer.on({
          mouseover: stableMouseoverCallback(properties),
          mouseout: stableMouseoutCallback,
          click: stableOnClickCallback
        });
        pointerOut();
    }

    function onEachVD(_: any, layer: any) {

        layer.on({
          mouseover: mouseOverVD,
          mouseout: stableMouseoutCallback
        });
        pointerOut();
    }

    function onClickFeature(event: any) {
        const layer = event.target;
        const properties = layer.feature.properties;

        if (properties.type === "State") {
            setGeoJsonId({geoid: properties.geoid, type: properties.type} as GeoID);
        } else if ((properties.type === "County" && returnCountyShouldInteract(changeYear, properties))) {
            setGeoJsonId({geoid: properties.geoid, type: properties.type} as GeoID);
        }
    }

    // React Hooks ---------------------------------------------------

    // on Click Rectangle - Resets the zoom and full screen to the us map
    const onClickRect = useMemo(
        () => ({
          click() {
            setGeoJsonId({geoid: defaultMap.geoid, type: defaultMap.type} as GeoID);
          }
        }),
        [geoJsonId]
    );

    useEffect(() => {

        if (geoJsonId.type === "US" || geoJsonId.type === "State") {
            setShowVD(false);
            setShowPolls(false);
        } else {
            setShowPolls(true);
        }

    }, [geoJsonId]);

    useEffect(() => {

        let featuresData: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: [] as GeoJSON.Feature[]
        };

        let boundaryData: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: [] as GeoJSON.Feature[]
        };

        // United State
        if (geoJsonId.type === "US") {
            setSelectedState(defaultState);
            setSelectedCounty(defaultCounty);

            featuresData.features = statesData.features.map((d: GeoJSON.Feature) => {
                                return { ...d, properties: { ...d.properties, selected: true } };
                            });

            mapRef.current.flyTo(defaultMap.latlng, defaultMap.zoom) // zooms to country level, otherwise react finds the center of the world map in Africa
                .on('moveend', () => {
                    setGeoJsonData(featuresData);
                    setLoadedGeoJsonData(true);
                });

        // Selected State
        } else if (geoJsonId.type === "State" && loadedCountyData) {

            let state = statesData.features.find((d: GeoJSON.Feature) => d.properties!.geoid === geoJsonId.geoid)!.properties as State;
            setSelectedState(state);
            setSelectedCounty(defaultCounty);

            featuresData.features = partOfSelectedState(countiesData, geoJsonId.geoid);
            boundaryData.features = partOfSelectedState(statesData, geoJsonId.geoid);

            mapRef.current.flyTo(state.latlng, state.zoom) // zooms to state level
            .on('moveend', () => {
                setGeoJsonData(filterGeoByBounds(mapRef, featuresData));
                setLoadedGeoJsonData(true);
                setGeoJsonBoundaryData(filterGeoByBounds(mapRef, boundaryData));
                setLoadedGeoJsonBoundaryData(true);
            });

        // Selected County
        } else if (geoJsonId.type === "County" && loadedCountyData && loadedTractData && loadedVdData && loadedPollingLocsData) {
            let county = countiesData.features.find((d: GeoJSON.Feature) => d.properties!.geoid === geoJsonId.geoid)!.properties as County;
            setSelectedCounty(county);

            featuresData.features = partOfSelectedCounty(tractsData, geoJsonId.geoid);
            boundaryData.features = partOfSelectedCounty(countiesData, geoJsonId.geoid);

            let vdfc: GeoJSON.FeatureCollection = {
                type: "FeatureCollection",
                features: partOfSelectedCounty(vdData, geoJsonId.geoid)
            };

            mapRef.current
                .flyTo(county.latlng, county.zoom) // zooms to county level
                .on('moveend', () => {
                    setGeoJsonData(filterGeoByBounds(mapRef, featuresData));
                    setLoadedGeoJsonData(true);
                    setGeoJsonBoundaryData(filterGeoByBounds(mapRef, boundaryData));
                    setLoadedGeoJsonBoundaryData(true);
                    setGeoJsonVdData(filterGeoByBounds(mapRef, vdfc));
                    setPollingLocsInBound(filterPointByBounds(mapRef, pollingLocsData));
                });
        }

    }, [geoJsonId, changeYear, tractsData, pollingLocsData, countiesData, statesData]);

    // Updates main geography and main boundary
    useEffect(() => {
        geoJsonRef.current?.clearLayers().addData(geoJsonData).setStyle((feature) => choroplethStyle(feature, equityIndicator) as PathOptions);
        geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData).setStyle((feature) => highlightGeographicBoundary(feature, equityIndicator) as PathOptions);

    }, [geoJsonBoundaryData, geoJsonData, equityIndicator, changeYear]);

    // Updates the voting districts
    useEffect(() => {
        if (showVD && loadedVdData) {
            geoJsonVdRef.current?.clearLayers().addData(geoJsonVdData).setStyle(vdStyle);
        } else {
            geoJsonVdRef.current?.clearLayers().addData({} as GeoJSON.FeatureCollection);
        }
    }, [geoJsonVdData, showVD, loadedVdData]);

    return(
        <>
            <Pane name="background-pane" style={{ zIndex: -100 }}>
                <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} eventHandlers={onClickRect} ref={rectRef}/>
            </Pane>
            <Pane name="geo-pane" style={{ zIndex: 100 }}>
                { loadedGeoJsonData ? <GeoJSON data={geoJsonData} style={layersStyle.default} onEachFeature={onEachFeature} ref={geoJsonRef} key="geoJsonAll"/>: null }
                { loadedGeoJsonBoundaryData ? <GeoJSON data={geoJsonBoundaryData} style={layersStyle.outline} ref={geoJsonBoundaryRef} key="geoJsonBoundary"/>: null }
                { showVD &&  loadedVdData ? <GeoJSON data={geoJsonVdData} style={vdStyle} onEachFeature={onEachVD} ref={geoJsonVdRef} key="geoJsonVD"/> :<></> }
            </Pane>
            <Pane name="poll-pane" style={{ zIndex: 200 }}>

            {selectedState.stfp !== '' && selectedCounty.cntyfp === '' ? 
                <FeatureGroup key="pollChangeSummaryFeatureGroup">
                    {
                        countiesData.features.map((feature: any, i: number) => {
                            if (feature.properties.changeYearData !== undefined) {
                                return (
                                    <Circle key={i} center={[feature.properties.latlng.lat, feature.properties.latlng.lng]} pathOptions={pollStyle(feature.properties.changeYearData.pollSummary, feature.properties!.stfp === geoJsonId.geoid)} radius={pollSummarySize(feature.properties.changeYearData.pollSummary)} eventHandlers={{
                                        click: () => {
                                            setGeoJsonId({geoid: feature.properties.geoid, 
                                                          type: feature.properties.type} as GeoID);
                                        },
                                        mouseover: () => {
                                            stableMouseoverPollSummaryCallback(feature);
                                        },
                                        mouseout: () => {    
                                            mouseOutPoll();
                                        }
                                    }}/>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </FeatureGroup> : null}
            {showPolls ?
                <FeatureGroup key="pollingLocFeatureGroup">
                    {pollingLocsInBound.map((d: PollingLoc, i: number) => {

                        return(
                            <Circle key={i} center={[d.latlng.lat, d.latlng.lng]} pathOptions={pollStyle(d, d.cntyfp === selectedCounty.cntyfp)} radius={200} eventHandlers={{
                            mouseover: () => {
                                mouseOverPollingLoc(d);
                            },
                            mouseout: () => {    
                                mouseOutPoll();
                            }
                          }}/>)
                        }
                    )}
                </FeatureGroup> : null}
            </Pane>
        </>
    )
}

export default function Map({ geoJsonId, setGeoJsonId, selectedState, setSelectedState, selectedCounty, setSelectedCounty, showPolls, 
                              setShowPolls, setPollHover, showVD, setShowVD, changeYear, equityIndicator, setGeoHover, 
                              pollingLocsData, statesData, countiesData, tractsData, vdData, 
                              loadedCountyData, loadedTractData, loadedVdData, loadedPollingLocsData,
                              setStatesData, setCountiesData, setTractsData }: 
                            { geoJsonId: GeoID, setGeoJsonId: any, selectedState: State, setSelectedState: any, 
                            selectedCounty: any,
                              setSelectedCounty: any, showPolls: boolean, setShowPolls: any, setPollHover: any, 
                              showVD: boolean, setShowVD: any, changeYear: ChangeYear, equityIndicator: EquityIndicator, 
                              setGeoHover: any, 
                              pollingLocsData: any, statesData: GeoJSON.FeatureCollection, countiesData: GeoJSON.FeatureCollection, tractsData: GeoJSON.FeatureCollection,
                              vdData: GeoJSON.FeatureCollection, loadedCountyData: boolean, loadedTractData: boolean, loadedVdData: boolean, loadedPollingLocsData: boolean,
                              setStatesData: any, setCountiesData: any, setTractsData: any }): JSX.Element {

    const mapRef = useRef(null);

    return(
        <MapContainer
            className="home-map"
            center={[defaultMap.latlng.lat, defaultMap.latlng.lng]}
            zoom={defaultMap.zoom}
            minZoom={4}
            maxZoom={18}
            scrollWheelZoom={false}
            zoomControl={false}
            ref={mapRef}
            >
            <Pane name="custom" style={{ zIndex: -1000 }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
            </Pane>
            <LayersComponent mapRef={mapRef} geoJsonId={geoJsonId} setGeoJsonId={setGeoJsonId} 
                             selectedState={selectedState} setSelectedState={setSelectedState} 
                             selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty}
                             showPolls={showPolls} setShowPolls={setShowPolls}
                             showVD={showVD} setShowVD={setShowVD} setPollHover={setPollHover}
                             changeYear={changeYear} equityIndicator={equityIndicator} setGeoHover={setGeoHover} 
                             pollingLocsData={pollingLocsData} countiesData={countiesData} tractsData={tractsData}
                             vdData={vdData} statesData={statesData}
                             loadedCountyData={loadedCountyData} loadedTractData={loadedTractData} loadedVdData={loadedVdData}
                             loadedPollingLocsData={loadedPollingLocsData}
                             setStatesData={setStatesData} setCountiesData={setCountiesData} setTractsData={setTractsData}
                             />
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
