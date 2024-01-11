// Libraries
import { useEffect, useMemo, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Rectangle, FeatureGroup } from "react-leaflet";
import { point, bounds } from 'leaflet';

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

function updateTracts(mapRef: any, county: County, setGeoJsonData: any) {
    const mapBounds = mapRef.current.getBounds();
    const mapNE = mapBounds?.getNorthEast();
    const mapSW = mapBounds?.getSouthWest();

    const mapBounds2 = bounds(point(mapSW!.lat, mapSW!.lng), point(mapNE!.lat, mapNE!.lng));                                   

    const tracts: any[] = [];

    unnestedTracts(county.stfp).features.forEach((d: any) => {

        var p1 = point(d.properties.bounds.southWest.lat, d.properties.bounds.southWest.lng),
            p2 = point(d.properties.bounds.northEast.lat, d.properties.bounds.northEast.lng),
        tractBounds = bounds(p1, p2);

        if (mapBounds2.overlaps(tractBounds)) {

            tracts.push(d);
        }
    })                            
    setGeoJsonData({type: 'FeatureCollection', features: tracts} as GeoJSON.FeatureCollection);
}

function LayersComponent({ mapRef, geoJsonId, setGeoJsonId, selectedState, setSelectedState, setSelectedCounty, showPolls, setShowPolls, showVD, setShowVD }: 
                         { mapRef: any, geoJsonId: GeoID, setGeoJsonId: any, selectedState: State, setSelectedState: any, setSelectedCounty: any, showPolls: boolean, setShowPolls: any, showVD: boolean, setShowVD: any}) {

    const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection>(stateData);
    const [geoJsonBoundaryData, setGeoJsonBoundaryData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);

    const geoJsonRef = useRef<L.GeoJSON<any, any>>(null);
    const geoJsonBoundaryRef = useRef<L.GeoJSON<any, any>>(null);

    // const [vdData, setVdData] = useState<GeoJSON.FeatureCollection>(selectedCounty!.vtdsts);
    const geoJsonVdLayer = useRef<L.GeoJSON<any, any>>(null);
    // console.log(vdData);

    // Functions ---------------------------------------------------

    function mouseOverTract(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.highlightTract);
        var coords = mapRef.current.latLngToContainerPoint(layer.feature.properties.latlng);
        Tooltip.pointerOver(coords.x, coords.y, `<span class="Bold">${layer.feature.properties.descr}: <span>${layer.feature.properties.name}</span>`);
    }

    function mouseOver(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.highlight);
        var coords = mapRef.current.latLngToContainerPoint(layer.feature.properties.latlng);
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

        if (geoJsonId.type === "US") {
            setSelectedState(defaultState);
            setSelectedCounty(defaultCounty);
            setGeoJsonBoundaryData({} as GeoJSON.FeatureCollection);
            setGeoJsonData(stateData);

            mapRef.current.flyTo(defaultMap.latlng, defaultMap.zoom); // zooms to country level, otherwise react finds the center of the world map in Africa

        } else if (geoJsonId.type === "State") {

            const state = stateData?.features.find(d => d.properties?.geoid === geoJsonId.geoid)?.properties as State;
            setSelectedState(state);
            setSelectedCounty(defaultCounty);
            setGeoJsonBoundaryData(stateData);
            setGeoJsonData(countyData);

            mapRef.current.flyTo(state.latlng, state.zoom); // zooms to state level
            
        } else {

            let county = {} as County;

            countyData.features.forEach((d: GeoJSON.Feature) => {
                if (d.properties!.geoid === geoJsonId.geoid) {
                    d.properties!.selected = true;
                    county = d.properties as County;
                } else {
                    d.properties!.selected = false;
                }
            });

            setSelectedCounty(county);
            setGeoJsonBoundaryData(countyData);

            mapRef.current.flyTo(county.latlng, county.zoom);

            mapRef.current.on('zoomend', () => {
                updateTracts(mapRef, county, setGeoJsonData)
            }).on('moveend', () => {
                updateTracts(mapRef, county, setGeoJsonData)
            });
        }

    }, [geoJsonId]);

    useEffect(() => {

        // Update boundary and interactive layer
        if (geoJsonId.type === 'County') {
            geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData).setStyle(highlightSelectedStyle);
            geoJsonRef.current?.clearLayers().addData(geoJsonData).setStyle(layersStyle.defaultTract); // Replaces geojson clickable elements with drilldown
        } else {
      
            geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData);
            geoJsonRef.current?.clearLayers().addData(geoJsonData); // Replaces geojson clickable elements with drilldown
        }

    }, [geoJsonBoundaryData, geoJsonData]);

    // useEffect(() => {
    //     if (geoJsonVdLayer.current) {
    //         geoJsonVdLayer.current?.clearLayers().addData(vdData);
    //     }
    // }, [vdData]);

    console.log(showVD);
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

export default function Map({ geoJsonId, setGeoJsonId, selectedState, setSelectedState, setSelectedCounty, showPolls, setShowPolls, showVD, setShowVD }: 
                            { geoJsonId: GeoID, setGeoJsonId: any, selectedState: State, setSelectedState: any, setSelectedCounty: any, showPolls: boolean, setShowPolls: any, showVD: boolean, setShowVD: any }): JSX.Element {

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
                             />
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
