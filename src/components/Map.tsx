// Libraries
import { useEffect, useMemo, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, Rectangle, FeatureGroup, Circle, Pane } from "react-leaflet";
import { point, bounds, PathOptions } from 'leaflet';

import * as d3 from 'd3';

// Components
import {mouseOverTextVD, mouseOverTextState, mouseOverTextCounty, mouseOverTextTract, pointerOver, pointerOut} from "./Tooltip";

// Types
import { State, County, GeoID, PollingLoc, ChangeYear, EquityIndicator } from "../utils/Types";

// Global
import { defaultMap, outerBounds, defaultCounty, defaultState } from "../utils/Global";
import { useStableCallback } from "../utils/Helper";

// Data
import { stateData } from "../utils/DM";

// Styles
import { layersStyle, highlightSelectedCounty, vdStyle, choroplethStyle, pollStyle } from "../utils/Theme";

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

// Updates feature data within the selected county to and make it distinct from surrounding voting districts
function updateSelectedFeature(data: GeoJSON.FeatureCollection, county: County) {

    data.features.forEach((d: GeoJSON.Feature) => {
        if ((d.properties!.cntyfp === county.cntyfp) && (d.properties!.stfp === county.stfp)) {
            d.properties!.selected = true;
        } else {
            d.properties!.selected = false;
        }
    });

    return data;
}

function LayersComponent({ mapRef, geoJsonId, setGeoJsonId, selectedState, setSelectedState, setSelectedCounty, showPolls, 
                           setShowPolls, setPollHover, showVD, setShowVD, changeYear, equityIndicator, setGeoHover, 
                           pollingLocsData, countiesData, tractsData, vdData, loadedCountyData, loadedTractData, loadedVdData }: 
                        {   mapRef: any, geoJsonId: GeoID, setGeoJsonId: any, selectedState: State, setSelectedState: any, 
                            setSelectedCounty: any, showPolls: boolean, setShowPolls: any, setPollHover: any, 
                            showVD: boolean, setShowVD: any, changeYear: ChangeYear, equityIndicator: EquityIndicator, 
                            setGeoHover: any, 
                            pollingLocsData: any, countiesData: GeoJSON.FeatureCollection, tractsData: GeoJSON.FeatureCollection,
                            vdData: GeoJSON.FeatureCollection,
                            loadedCountyData: boolean, loadedTractData: boolean, loadedVdData: boolean }) {

    const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection>(stateData);
    const [geoJsonBoundaryData, setGeoJsonBoundaryData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);
    const [geoJsonVdData, setGeoJsonVdData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);

    const [pollingLocsInBound, setPollingLocsInBound] = useState<any[]>([]);

    const rectRef = useRef<L.Rectangle>(null);
    const geoJsonRef = useRef<L.GeoJSON<any, any>>(null);
    const geoJsonBoundaryRef = useRef<L.GeoJSON<any, any>>(null);
    const geoJsonVdRef = useRef<L.GeoJSON<any, any>>(null);
    const pollRef = useRef<L.FeatureGroup>(null);

    // Functions ---------------------------------------------------

    const stableMouseoutCallback = useStableCallback(mouseOut);
    const stableMouseoverTractCallback = useStableCallback(mouseOverTract);
    const stableMouseoverCountyCallback = useStableCallback(mouseOverCounty);

    function mouseOverPollingLoc(d: any) {
        var coords = mapRef.current.latLngToContainerPoint(d.latlng);
        pointerOver(coords.x, coords.y, `<span class="SemiBold">${d.name}</span><br><span class=${d.status}>Status: ${d.status}</span>`);
        setPollHover(d);
    }

    function mouseOverVD(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.VD.highlight);
        var coords = mapRef.current.latLngToContainerPoint(layer.feature.properties.latlng);
        pointerOver(coords.x, coords.y, mouseOverTextVD(layer.feature));
    }

    function mouseOverTract(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.Tract.highlight);
        var coords = mapRef.current.latLngToContainerPoint(layer.feature.properties.latlng);
        pointerOver(coords.x, coords.y, mouseOverTextTract(layer.feature, equityIndicator, changeYear));
        setGeoHover(layer.feature.properties);
    }

    function mouseOverCounty(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.County.highlight);
        var coords = mapRef.current.latLngToContainerPoint(layer.feature.properties.latlng);
        pointerOver(coords.x, coords.y, mouseOverTextCounty(layer.feature, equityIndicator, changeYear));
        d3.select(".Status .ComponentGroupInner span").attr("class", "focus"); //removes extra awkard space in tooltip
        setGeoHover(layer.feature.properties);
    }

    function mouseOverState(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.State.highlight);
        var coords = mapRef.current.latLngToContainerPoint(layer.feature.properties.latlng);
        pointerOver(coords.x, coords.y, mouseOverTextState(layer.feature));
        d3.select(".Status .ComponentGroupInner span").attr("class", "focus"); //removes extra awkard space in tooltip
    }

    function mouseOutPollingLoc() {
        pointerOut();
        setPollHover({});
    }

    function mouseOut(event: any) {
        var layer = event.target;
        layer.setStyle(choroplethStyle(layer.feature, equityIndicator) as PathOptions);
        pointerOut();
        d3.select(".Status .ComponentGroupInner span").attr("class", "");
        setGeoHover({});
    }

    function onEachFeature(_: any, layer: any) {

        const properties = layer.feature.properties;

        layer.on({
          mouseover: properties.type === "State" ? mouseOverState : properties.type === "County" ? stableMouseoverCountyCallback: stableMouseoverTractCallback,
          mouseout: stableMouseoutCallback,
          click: onClickFeature
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

        if (properties.type !== "Tract") {
            setGeoJsonId({geoid: properties.geoid, name: properties.name, type: properties.type, latlng: properties.latlng, zoom: properties.zoom} as GeoID);
        }        
    }

    // React Hooks ---------------------------------------------------

    // on Click Rectangle - Resets the zoom and full screen to the us map
    const onClickRect = useMemo(
        () => ({
          click() {
            setGeoJsonId({geoid: defaultMap.geoid, name: defaultMap.name, type: defaultMap.type, latlng: defaultMap.latlng, zoom: defaultMap.zoom} as GeoID);
          }
        }),
        [geoJsonId]
    );

    useEffect(() => {

        // United State
        if (geoJsonId.type === "US") {
            setSelectedState(defaultState);
            setSelectedCounty(defaultCounty);
            setGeoJsonBoundaryData({} as GeoJSON.FeatureCollection);
            setShowVD(false);
            setShowPolls(false);

            mapRef.current.flyTo(defaultMap.latlng, defaultMap.zoom) // zooms to country level, otherwise react finds the center of the world map in Africa
                .on('zoomend', () => {
                    setGeoJsonData(stateData);
                })
                .on('moveend', () => {
                    setGeoJsonData(stateData);
                });

        // Selected State
        } else if (geoJsonId.type === "State" && loadedCountyData) {

            const state = stateData?.features.find(d => d.properties?.geoid === geoJsonId.geoid)?.properties as State;
            setSelectedState(state);
            setSelectedCounty(defaultCounty);
            setGeoJsonBoundaryData(stateData);
            setShowVD(false);
            setShowPolls(false);

            mapRef.current.flyTo(state.latlng, state.zoom) // zooms to state level
            .on('zoomend', () => {
                setGeoJsonData(filterGeoByBounds(mapRef, countiesData));
            })
            .on('moveend', () => {
                setGeoJsonData(filterGeoByBounds(mapRef, countiesData));
            });

        // Selected County
        } else if (loadedCountyData && loadedTractData) {
            let county = {} as County;

            // Updates counties within the selected county to and make it distinct from surrounding counties
            countiesData.features.forEach((d: GeoJSON.Feature) => {
                if (d.properties!.geoid === geoJsonId.geoid) {
                    d.properties!.selected = true;
                    county = d.properties as County;
                } else {
                    d.properties!.selected = false;
                }
            });

            // Updates tract within the selected county to and make it distinct from surrounding tracts
            updateSelectedFeature(tractsData as GeoJSON.FeatureCollection || [], county);

            // Updates voting districts within the selected county to and make it distinct from surrounding voting districts
            updateSelectedFeature(vdData, county);
          
            setSelectedCounty(county);
            setShowPolls(true);

            mapRef.current
                .flyTo(county.latlng, county.zoom) // zooms to county level
                .on('zoomend', () => {
                    setGeoJsonBoundaryData(filterGeoByBounds(mapRef, countiesData));
                    setGeoJsonData(filterGeoByBounds(mapRef, tractsData));
                    setGeoJsonVdData(filterGeoByBounds(mapRef, vdData));
                    setPollingLocsInBound(filterPointByBounds(mapRef, pollingLocsData));
                })
                .on('moveend', () => {
                    setGeoJsonBoundaryData(filterGeoByBounds(mapRef, countiesData));
                    setGeoJsonData(filterGeoByBounds(mapRef, tractsData));
                    setGeoJsonVdData(filterGeoByBounds(mapRef, vdData));
                    setPollingLocsInBound(filterPointByBounds(mapRef, pollingLocsData));
                });
        }

    }, [geoJsonId, changeYear, tractsData, pollingLocsData, countiesData, loadedCountyData]);

    // Updates main geography and main boundary
    useEffect(() => {
        // Update boundary and interactive layer
        if (geoJsonId.type === 'County') {
            if (equityIndicator.variable === 'none') {
                geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData).setStyle(highlightSelectedCounty);
                geoJsonRef.current?.clearLayers().addData(geoJsonData).setStyle((feature) => choroplethStyle(feature, equityIndicator) as PathOptions); // Replaces geojson clickable elements with drilldown
            } else {
                geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData)
                geoJsonRef.current?.clearLayers().addData(geoJsonData).setStyle((feature) => choroplethStyle(feature, equityIndicator) as PathOptions);
            }
        } else {

            if (equityIndicator.variable === 'none') {
                geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData);
                geoJsonRef.current?.clearLayers().addData(geoJsonData); // Replaces geojson clickable elements with drilldown
            } else {
                geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData)
                geoJsonRef.current?.clearLayers().addData(geoJsonData).setStyle((feature) => choroplethStyle(feature, equityIndicator) as PathOptions);
            }   
        }

    }, [geoJsonBoundaryData, geoJsonData, equityIndicator, changeYear]);

    // Updates the voting districts
    useEffect(() => {
        if (showVD) {
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
                {selectedState.stfp !== '' ? <GeoJSON data={geoJsonBoundaryData} style={layersStyle.outline} ref={geoJsonBoundaryRef} key="geoJsonBoundary"/> : null}
                <GeoJSON data={geoJsonData} style={layersStyle.default} onEachFeature={onEachFeature} ref={geoJsonRef} key="geoJsonAll"/>
                {showVD &&  loadedVdData ? <GeoJSON data={geoJsonVdData} style={vdStyle} onEachFeature={onEachVD} ref={geoJsonVdRef} key="geoJsonVD"/> :<></> }
            </Pane>
            <Pane name="poll-pane" style={{ zIndex: 200 }}>
            {showPolls ?
                <FeatureGroup ref={pollRef} key="pollingLocFeatureGroup">
                    {pollingLocsInBound.map((d: PollingLoc, i: number) => (
                        <Circle key={i} center={[d.latlng.lat, d.latlng.lng]} pathOptions={pollStyle(d)} radius={200} eventHandlers={{
                            click: () => {
                            //   console.log('marker clicked')
                            },
                            mouseover: () => {
                                mouseOverPollingLoc(d);
                            },
                            mouseout: () => {    
                                mouseOutPollingLoc();
                            }
                          }}/>
                    ))}
                </FeatureGroup> : null}
            </Pane>
        </>
    )
}

export default function Map({ geoJsonId, setGeoJsonId, selectedState, setSelectedState, setSelectedCounty, showPolls, 
                              setShowPolls, setPollHover, showVD, setShowVD, changeYear, equityIndicator, setGeoHover, 
                              pollingLocsData, countiesData, tractsData, 
                              vdData, loadedCountyData, loadedTractData, loadedVdData }: 
                            { geoJsonId: GeoID, setGeoJsonId: any, selectedState: State, setSelectedState: any, 
                              setSelectedCounty: any, showPolls: boolean, setShowPolls: any, setPollHover: any, 
                              showVD: boolean, setShowVD: any, changeYear: ChangeYear, equityIndicator: EquityIndicator, 
                              setGeoHover: any, 
                              pollingLocsData: any, countiesData: GeoJSON.FeatureCollection, tractsData: GeoJSON.FeatureCollection,
                              vdData: GeoJSON.FeatureCollection, loadedCountyData: boolean, loadedTractData: boolean, loadedVdData: boolean }): JSX.Element {

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
                             setSelectedCounty={setSelectedCounty}
                             showPolls={showPolls} setShowPolls={setShowPolls}
                             showVD={showVD} setShowVD={setShowVD} setPollHover={setPollHover}
                             changeYear={changeYear} equityIndicator={equityIndicator} setGeoHover={setGeoHover} 
                             pollingLocsData={pollingLocsData} countiesData={countiesData} tractsData={tractsData}
                             vdData={vdData} 
                             loadedCountyData={loadedCountyData} loadedTractData={loadedTractData} loadedVdData={loadedVdData}
                             />
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
