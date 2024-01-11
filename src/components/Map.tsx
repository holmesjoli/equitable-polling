// Libraries
import { useEffect, useMemo, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Rectangle, FeatureGroup } from "react-leaflet";

// Components
import * as Tooltip from "./Tooltip";

// Types
import { State, County, GeoID } from "../utils/Types";

// Global
import { defaultMap, outerBounds, defaultCounty, defaultState } from "../utils/Global";

// Data
import { unnestedTracts, countyData, stateData } from "../utils/DM";

// Styles 
import { layersStyle, highlightSelectedStyle } from "../utils/Theme";

export function mouseOut(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.default);
    Tooltip.pointerOut();
}

export function mouseOutTract(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.defaultTract);
    Tooltip.pointerOut();
}

function LayersComponent({ geoJsonId, setGeoJsonId, selectedState, setSelectedState, selectedCounty, setSelectedCounty, showPolls, setShowPolls, showVD, setShowVD }: 
                         { geoJsonId: GeoID, setGeoJsonId: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any, showPolls: boolean, setShowPolls: any, showVD: boolean, setShowVD: any}) {

    const map = useMap();

    // const [countyLayerData, setCountyLayerData] = useState<GeoJSON.FeatureCollection>(countyData);
    const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection>(stateData);
    const [geoJsonBoundaryData, setGeoJsonBoundaryData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);

    const geoJsonRef = useRef<L.GeoJSON<any, any>>(null);
    const geoJsonBoundaryRef = useRef<L.GeoJSON<any, any>>(null);

    // Functions ---------------------------------------------------

    function mouseOverTract(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.highlightTract);
        var coords = map.latLngToContainerPoint(layer.feature.properties.latlng);
        Tooltip.pointerOver(coords.x, coords.y, `<span class="Bold">${layer.feature.properties.descr}: <span>${layer.feature.properties.name}</span>`);
    }

    function mouseOver(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.highlight);
        var coords = map.latLngToContainerPoint(layer.feature.properties.latlng);
        Tooltip.pointerOver(coords.x, coords.y, `<span class="Bold">${layer.feature.properties.name} ${layer.feature.properties.descr}</span>`);
    }

    function onEachFeature(_: any, layer: any) {

        const properties = layer.feature.properties;

        layer.on({
          mouseover: properties.type === "Tract" ? mouseOverTract: mouseOver,
          mouseout: properties.type === "Tract" ? mouseOutTract: mouseOut,
          click: onClickFeature
        });
        Tooltip.pointerOut();
    }

    function onClickFeature(event: any) {
        const layer = event.target;
        const properties = layer.feature.properties;
        setGeoJsonId({geoid: properties.geoid, name: properties.name, type: properties.type, latlng: properties.latlng, zoom: properties.zoom} as GeoID);
    }

    // React Hooks ---------------------------------------------------

    // on Click Rectangle - Resets the zoom and full screen to the us map
    const onClickRect = useMemo(
        () => ({
          click() {
            map.flyTo(defaultMap.latlng, defaultMap.zoom);
            setSelectedState(defaultState);
            setSelectedCounty(defaultCounty);
          },
        }),
        [map]
    );

    useEffect(() => {

        if (geoJsonId.type === "US") {
            setSelectedState(defaultState);
            setSelectedCounty(defaultCounty);
            setGeoJsonBoundaryData({} as GeoJSON.FeatureCollection);
            setGeoJsonData(stateData);

            map.flyTo(defaultMap.latlng, defaultMap.zoom); // zooms to country level, otherwise react finds the center of the world map in Africa

            // Update boundary and interactive layer
            geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData);
            geoJsonRef.current?.clearLayers().addData(geoJsonData); // Replaces geojson clickable elements with drilldown

        } else if (geoJsonId.type === "State") {

            const state = stateData?.features.find(d => d.properties?.geoid === geoJsonId.geoid)?.properties as State;
            setSelectedState(state);
            setSelectedCounty(defaultCounty);
            setGeoJsonBoundaryData(stateData);
            setGeoJsonData(countyData);

            map.flyTo(state.latlng, state.zoom); // zooms to state level

            // Update boundary and interactive layer
            geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData);
            geoJsonRef.current?.clearLayers().addData(geoJsonData); // Replaces geojson clickable elements with drilldown
            
        } else {

            countyData.features.forEach((d: GeoJSON.Feature) => {
                if (d.properties!.geoid === geoJsonId.geoid) {
                    d.properties!.selected = true;
                } else {
                    d.properties!.selected = false;
                }
            });

            const county = countyData?.features.find(d => d.properties?.selected)?.properties as County;
            setSelectedCounty(county);
            setGeoJsonBoundaryData(countyData);

            console.log(county);

            const tracts = unnestedTracts(county.stfp);
            setGeoJsonData(tracts);

            console.log(tracts);
            map.flyTo(county.latlng, county.zoom);

             // Update interactive layer
            geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData).setStyle(highlightSelectedStyle);
            geoJsonRef.current?.clearLayers().addData(geoJsonData).setStyle(layersStyle.defaultTract); // Replaces geojson clickable elements with drilldown
        }

    }, [geoJsonId]);

    useEffect(() => {

        if (geoJsonId.type === 'Tract') {
            // Update boundary and interactive layer
            geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData).setStyle(highlightSelectedStyle);
            geoJsonRef.current?.clearLayers().addData(geoJsonData).setStyle(layersStyle.defaultTract); // Replaces geojson clickable elements with drilldown
        } else {
            // Update boundary and interactive layer
            geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData);
            geoJsonRef.current?.clearLayers().addData(geoJsonData); // Replaces geojson clickable elements with drilldown
        }
    }, [geoJsonBoundaryData, geoJsonData]);

    return(
        <div className="Layers">
            <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} eventHandlers={onClickRect}/>
            <FeatureGroup>
                {selectedState.stfp !== '' ? <GeoJSON data={geoJsonBoundaryData} style={layersStyle.outline} ref={geoJsonBoundaryRef} key="geoJsonBoundary"/> : null}
                <GeoJSON data={geoJsonData} style={layersStyle.default} onEachFeature={onEachFeature} ref={geoJsonRef} key="geoJsonAll"/>
            </FeatureGroup>
        </div>
    )
}

export default function Map({ geoJsonId, setGeoJsonId, selectedState, setSelectedState, selectedCounty, setSelectedCounty, showPolls, setShowPolls, showVD, setShowVD }: 
                            { geoJsonId: GeoID, setGeoJsonId: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any, showPolls: boolean, setShowPolls: any, showVD: boolean, setShowVD: any }): JSX.Element {

    return(
        <MapContainer
            className="home-map"
            center={[defaultMap.latlng.lat, defaultMap.latlng.lng]}
            zoom={defaultMap.zoom}
            minZoom={4}
            maxZoom={18}
            scrollWheelZoom={false}
            zoomControl={false}
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <LayersComponent geoJsonId={geoJsonId} setGeoJsonId={setGeoJsonId} 
                             selectedState={selectedState} setSelectedState={setSelectedState} 
                             selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty}
                             showPolls={showPolls} setShowPolls={setShowPolls}
                             showVD={showVD} setShowVD={setShowVD}
                             />
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
