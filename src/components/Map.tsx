// Libraries
import { useEffect, useMemo, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, Rectangle, FeatureGroup } from "react-leaflet";
import { point, bounds, PathOptions } from 'leaflet';
import * as d3 from 'd3';

// Components
import * as Tooltip from "./Tooltip";

// Types
import { State, County, GeoID, ChangeYear, EquityIndicator } from "../utils/Types";

// Global
import { defaultMap, outerBounds, defaultCounty, defaultState } from "../utils/Global";

// Data
import { stateData, getCounties, getTracts, vdData } from "../utils/DM";

// Styles 
import { layersStyle, highlightSelectedCounty, vdStyle, tractStyle, choroplethStyle } from "../utils/Theme";

function mouseOut(event: any) {
    var layer = event.target;
    layer.setStyle(choroplethStyle(layer.feature));
    Tooltip.pointerOut();
    d3.select(".Status .ComponentGroupInner span").attr("class", "");
}

function mouseOverGeo(properties: any) {
    return `${properties.name} ${properties.descr} <br>`;
}

function mouseOverEquityMeasure(properties: any) {
    if(properties.equityIndicator.variable !== 'none') {
    return `${properties.equityIndicator.equityMeasure} ${properties.equityIndicator.descr}`
    }
}

function mouseOverTextVD(properties: any) {
    return `<span class="SemiBold">${mouseOverGeo(properties)}</span>`
}

function mouseOverTextTract(properties: any) {
    return `<span class="SemiBold">${mouseOverGeo(properties)} ${mouseOverEquityMeasure(properties)}</span>`
}

function mouseOverTextCounty(properties: any) {
    return `<span class="SemiBold"> ${mouseOverGeo(properties)} ${mouseOverEquityMeasure(properties)}</span>`
}

function mouseOverTextState(properties: any) {
    return `<span class="SemiBold">${mouseOverGeo(properties)} </span>`
}

// Returns a list of geographies which are current in view
function filterByBounds(mapRef: any, data: any) {

    const mapBounds = mapRef.current.getBounds();
    const mapNE = mapBounds?.getNorthEast();
    const mapSW = mapBounds?.getSouthWest();
    const mapBounds2 = bounds(point(mapSW!.lat, mapSW!.lng), point(mapNE!.lat, mapNE!.lng));                                   

    const features: any[] = [];

    data.features.forEach((d: any) => {

        var p1 = point(d.properties.bounds.southWest.lat, d.properties.bounds.southWest.lng),
            p2 = point(d.properties.bounds.northEast.lat, d.properties.bounds.northEast.lng),
            tractBounds = bounds(p1, p2);

        if (mapBounds2.intersects(tractBounds)) {
            features.push(d);
        }
    });

    return {type: 'FeatureCollection', features: features} as GeoJSON.FeatureCollection;
}

function LayersComponent({ mapRef, geoJsonId, setGeoJsonId, selectedState, setSelectedState, setSelectedCounty, showPolls, setShowPolls, showVD, setShowVD, changeYear, equityIndicator }: 
                         { mapRef: any, geoJsonId: GeoID, setGeoJsonId: any, selectedState: State, setSelectedState: any, setSelectedCounty: any, showPolls: boolean, setShowPolls: any, showVD: boolean, setShowVD: any, changeYear: ChangeYear, equityIndicator: EquityIndicator}) {

    const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection>(stateData);
    const [geoJsonBoundaryData, setGeoJsonBoundaryData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);
    const [geoJsonVdData, setGeoJsonVdData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);

    const [countyData, setCountyData] = useState<GeoJSON.FeatureCollection>(getCounties(changeYear, equityIndicator));
    const [tractData, setTractData] = useState<GeoJSON.FeatureCollection>(getTracts(changeYear, equityIndicator));

    // console.log(countyData);
    // console.log(geoJsonData);

    const geoJsonRef = useRef<L.GeoJSON<any, any>>(null);
    const geoJsonBoundaryRef = useRef<L.GeoJSON<any, any>>(null);
    const geoJsonVdRef = useRef<L.GeoJSON<any, any>>(null);

    // Functions ---------------------------------------------------

    function mouseOverVD(event: any) {
        var layer = event.target;
        // layer.setStyle(layersStyle.VD.highlight);
        var coords = mapRef.current.latLngToContainerPoint(layer.feature.properties.latlng);
        Tooltip.pointerOver(coords.x, coords.y, mouseOverTextVD(layer.feature.properties));
    }

    function mouseOverTract(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.Tract.highlight);
        var coords = mapRef.current.latLngToContainerPoint(layer.feature.properties.latlng);
        Tooltip.pointerOver(coords.x, coords.y, mouseOverTextTract(layer.feature.properties));
    }

    function mouseOverCounty(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.County.highlight);
        var coords = mapRef.current.latLngToContainerPoint(layer.feature.properties.latlng);
        Tooltip.pointerOver(coords.x, coords.y, mouseOverTextCounty(layer.feature.properties));
        d3.select(".Status .ComponentGroupInner span").attr("class", "focus");
    }

    function mouseOverState(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.State.highlight);
        var coords = mapRef.current.latLngToContainerPoint(layer.feature.properties.latlng);
        Tooltip.pointerOver(coords.x, coords.y, mouseOverTextState(layer.feature.properties));
        d3.select(".Status .ComponentGroupInner span").attr("class", "focus");
    }

    function onEachFeature(_: any, layer: any) {

        const properties = layer.feature.properties;

        layer.on({
          mouseover: properties.type === "State" ? mouseOverState : properties.type === "County" ? mouseOverCounty: mouseOverTract,
          mouseout: mouseOut,
          click: onClickFeature
        });
        Tooltip.pointerOut();
    }

    function onEachVD(_: any, layer: any) {

        layer.on({
          mouseover: mouseOverVD,
          mouseout: mouseOut
        });
        Tooltip.pointerOut();
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
        setCountyData(getCounties(changeYear, equityIndicator));
        setTractData(getTracts(changeYear, equityIndicator));
    }, [equityIndicator, changeYear]);

    useEffect(() => {
        // United State
        if (geoJsonId.type === "US") {
            setSelectedState(defaultState);
            setSelectedCounty(defaultCounty);
            setGeoJsonBoundaryData({} as GeoJSON.FeatureCollection);

            mapRef.current.flyTo(defaultMap.latlng, defaultMap.zoom) // zooms to country level, otherwise react finds the center of the world map in Africa
                .on('zoomend', () => {
                    setGeoJsonData(stateData);
                })
                .on('moveend', () => {
                    setGeoJsonData(stateData);
                });

        // Selected State
        } else if (geoJsonId.type === "State") {

            const state = stateData?.features.find(d => d.properties?.geoid === geoJsonId.geoid)?.properties as State;
            setSelectedState(state);
            setSelectedCounty(defaultCounty);
            setGeoJsonBoundaryData(stateData);

            mapRef.current.flyTo(state.latlng, state.zoom) // zooms to state level
            .on('zoomend', () => {
                setGeoJsonData(filterByBounds(mapRef, countyData));
            })
            .on('moveend', () => {
                setGeoJsonData(filterByBounds(mapRef, countyData));
            });

        // Selected County
        } else {
            let county = {} as County;

            // Updates selected county which is need to style the county and make it distinct from surrounding counties
            countyData.features.forEach((d: GeoJSON.Feature) => {
                if (d.properties!.geoid === geoJsonId.geoid) {
                    d.properties!.selected = true;
                    county = d.properties as County;
                } else {
                    d.properties!.selected = false;
                }
            });

            // Updates selected county which is need to style the county and make it distinct from surrounding counties
            tractData.features.forEach((d: GeoJSON.Feature) => {
                if ((d.properties!.cntyfp === county.cntyfp) && (d.properties!.stfp === county.stfp)) {
                    d.properties!.selected = true;
                } else {
                    d.properties!.selected = false;
                }
            });

            // Updates selected county which is need to style the county and make it distinct from surrounding counties
            vdData.features.forEach((d: GeoJSON.Feature) => {
                if ((d.properties!.cntyfp === county.cntyfp) && (d.properties!.stfp === county.stfp)) {
                    d.properties!.selected = true;
                } else {
                    d.properties!.selected = false;
                }
            });

            setSelectedCounty(county);

            mapRef.current
                .flyTo(county.latlng, county.zoom) // zooms to county level
                .on('zoomend', () => {
                    setGeoJsonBoundaryData(filterByBounds(mapRef, countyData));
                    setGeoJsonData(filterByBounds(mapRef, tractData));
                    setGeoJsonVdData(filterByBounds(mapRef, vdData));
                })
                .on('moveend', () => {
                    setGeoJsonBoundaryData(filterByBounds(mapRef, countyData));
                    setGeoJsonData(filterByBounds(mapRef, tractData));
                    setGeoJsonVdData(filterByBounds(mapRef, vdData));
                });
        }

    }, [geoJsonId, countyData, tractData]);

    // Updates main geography and main boundary
    useEffect(() => {

            // Update boundary and interactive layer
            if (geoJsonId.type === 'County') {
                if (equityIndicator.variable === 'none') {
                    geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData).setStyle(highlightSelectedCounty);
                    geoJsonRef.current?.clearLayers().addData(geoJsonData).setStyle(tractStyle); // Replaces geojson clickable elements with drilldown
                } else {
                    geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData)
                    geoJsonRef.current?.clearLayers().addData(geoJsonData).setStyle(choroplethStyle as PathOptions);
                }
            } else {

                if (equityIndicator.variable === 'none') {
                    geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData);
                    geoJsonRef.current?.clearLayers().addData(geoJsonData); // Replaces geojson clickable elements with drilldown
                } else {
                    geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData)
                    geoJsonRef.current?.clearLayers().addData(geoJsonData).setStyle(choroplethStyle as PathOptions);
                }   
            }

    }, [geoJsonBoundaryData, geoJsonData, countyData, tractData]);

    // Updates the voting districts
    useEffect(() => {
        if (showVD) {
            geoJsonVdRef.current?.clearLayers().addData(geoJsonVdData).setStyle(vdStyle);
        } else {
            geoJsonVdRef.current?.clearLayers().addData({} as GeoJSON.FeatureCollection);
        }
    }, [geoJsonVdData]);

    return(
        <>
            <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} eventHandlers={onClickRect}/>
            <FeatureGroup>
                {selectedState.stfp !== '' ? <GeoJSON data={geoJsonBoundaryData} style={layersStyle.outline} ref={geoJsonBoundaryRef} key="geoJsonBoundary"/> : null}
                <GeoJSON data={geoJsonData} style={layersStyle.default} onEachFeature={onEachFeature} ref={geoJsonRef} key="geoJsonAll"/>
                {showVD ? <GeoJSON data={geoJsonVdData} style={vdStyle} onEachFeature={onEachVD} ref={geoJsonVdRef} key="geoJsonVD"/> :<></> }
            </FeatureGroup>
        </>
    )
}

export default function Map({ geoJsonId, setGeoJsonId, selectedState, setSelectedState, setSelectedCounty, showPolls, setShowPolls, showVD, setShowVD, changeYear, equityIndicator }: 
                            { geoJsonId: GeoID, setGeoJsonId: any, selectedState: State, setSelectedState: any, setSelectedCounty: any, showPolls: boolean, setShowPolls: any, showVD: boolean, setShowVD: any, changeYear: ChangeYear, equityIndicator: EquityIndicator }): JSX.Element {

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
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <LayersComponent mapRef={mapRef} geoJsonId={geoJsonId} setGeoJsonId={setGeoJsonId} 
                             selectedState={selectedState} setSelectedState={setSelectedState} 
                             setSelectedCounty={setSelectedCounty}
                             showPolls={showPolls} setShowPolls={setShowPolls}
                             showVD={showVD} setShowVD={setShowVD}
                             changeYear={changeYear} equityIndicator={equityIndicator}
                             />
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
