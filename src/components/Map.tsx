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
import { unnestedTracts, unnestedCountyData, nestedStateData, updateSelectedCounty } from "../utils/DM";

// Styles 
import { layersStyle, highlightSelectedStyle } from "../utils/Theme";

export function mouseOver(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.highlight);
    Tooltip.pointerOver(event.originalEvent.clientX, event.originalEvent.clientY, layer.feature.properties.name);
}

export function mouseOut(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.default);
    Tooltip.pointerOut();
}

export function mouseOverTract(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.highlightTract);
    Tooltip.pointerOver(event.originalEvent.clientX, event.originalEvent.clientY, layer.feature.properties.name);
}

export function mouseOutTract(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.defaultTract);
    Tooltip.pointerOut();
}

function LayersComponent({ mapRef, geoJsonId, setGeoJsonId, selectedState, setSelectedState, selectedCounty, setSelectedCounty, showPolls, setShowPolls, showVD, setShowVD }: 
                         { mapRef: any, geoJsonId: GeoID, setGeoJsonId: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any, showPolls: boolean, setShowPolls: any, showVD: boolean, setShowVD: any}) {

    const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection>(nestedStateData);

    const geoJsonRef = useRef<L.GeoJSON<any, any>>(null);

    const onDrillDown = (event: any) => {
        const layer = event.target;
        const properties = layer.feature.properties;
        setGeoJsonId({geoid: properties.geoid, type: properties.type, latlng: properties.latlng, zoom: properties.zoom} as GeoID);
        setGeoJsonData(unnestedCountyData);
    }

    console.log(geoJsonId);
    
    useEffect(() => {
        // if (mapRef.current && geoJsonRef.current) {

        //     console.log(mapRef.current.getBounds());
        //     console.log(geoJsonRef.current.getBounds());
    
        //     // mapRef.current.fitBounds(
        //     //     geoJsonRef.current.getBounds()
        //     // );
        // }

        if (geoJsonId.geoid != '0') {
            mapRef.current.flyTo(geoJsonId!.latlng, geoJsonId!.zoom); // zooms to new map location
            geoJsonRef.current?.clearLayers().addData(geoJsonData); // Replaces geojson clickable elements with drilldown
        }
    }, [geoJsonId]);


    // Functions ---------------------------------------------------

    function onEachState(_: any, layer: any) {
        layer.on({
          mouseover: mouseOver,
          mouseout: mouseOut,
          click: onDrillDown
        });
        Tooltip.pointerOut();
    }

    function onClickState(event: any) {
        var layer = event.target;
        const clickedState = nestedStateData.features.find((d: GeoJSON.Feature) => d.properties!.stfp === layer.feature.properties.stfp)!.properties;
        setSelectedState(clickedState as State);
        setSelectedCounty(defaultCounty);

        // map.flyTo(clickedState!.latlng, clickedState!.zoom);
    }

    function onEachCounty(_: any, layer: any) {
        layer.on({
          mouseover: mouseOver,
          mouseout: mouseOut,
          click: onClickCounty
        });
    }

    function onClickCounty(event: any) {
        var layer = event.target;
        updateSelectedCounty(selectedState, setSelectedState, layer.feature.properties.cntyfp);
        const clickedCounty = selectedState.counties.features.find(d => d.properties!.cntyfp === layer.feature.properties.cntyfp)!.properties;
        setSelectedCounty(clickedCounty as County);
        Tooltip.pointerOut();
        // map.flyTo(clickedCounty!.latlng, clickedCounty!.zoom);
    }

    function onEachTract(_: any, layer: any) {
        layer.on({
          mouseover: mouseOverTract,
          mouseout: mouseOutTract
        });
    }

    // React Hooks ---------------------------------------------------

    // on Click Rectangle - Resets the zoom and full screen to the us map
    const onClickRect = useMemo(
        () => ({
          click() {
            mapRef.current.flyTo(defaultMap.latlng, defaultMap.zoom);
            // setSelectedState(defaultState);
            // console.log(map.getBounds());
          }
        }),
        [geoJsonId]
    );

    // useEffect(() => {
    //     map.flyTo(selectedState.latlng, selectedState.zoom);
    //     console.log(map.getBounds());
    // }, [selectedState]);

    // useEffect(() => {

    //     // if else add otherwise react finds the center of the world map in Africa
    //     if (selectedCounty.stfp !== "") {
    //         map.flyTo(selectedCounty.latlng, selectedCounty.zoom);
    //     } else {
    //         map.flyTo(selectedState.latlng, selectedState.zoom);
    //     }

    //     // Update the color of the county when county is updated
    //     map.eachLayer((layer) => {
    //         if ((layer as any).feature) {
    //             if ((layer as any).feature.properties.selected) {
    //                 (layer as any).setStyle(highlightSelectedStyle((layer as any).feature));
    //             }
    //         }
    //     });

    //     setTractsData(unnestedTracts(selectedState));

    //     // console.log(map.getBounds());
    // }, [selectedCounty, selectedState]);


    // useEffect(() => {
    //     if (geoJsonTractsLayer.current) {
    //         geoJsonTractsLayer.current?.clearLayers().addData(tractsData);
    //     }
    // }, [tractsData]);

    return(
        <div className="Layers">
            <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} eventHandlers={onClickRect}/>
            <GeoJSON data={geoJsonData} style={layersStyle.default} onEachFeature={onEachState} ref={geoJsonRef} key="geoJsonAll"/>
            {/* {selectedState.stfp === "" ?
                <GeoJSON data={nestedStateData} style={layersStyle.default} onEachFeature={onEachState} /> : 
                <FeatureGroup>
                    <GeoJSON data={nestedStateData} style={layersStyle.selected} />
                    {selectedCounty.cntyfp === "" ? 
                        <GeoJSON data={unnestedCountyData} style={layersStyle.default} onEachFeature={onEachCounty} />
                    :
                        <FeatureGroup>
                            <GeoJSON data={unnestedCountyData} style={highlightSelectedStyle}/>
                            <GeoJSON key="tract-geo-layer" ref={geoJsonTractsLayer} data={tractsData} style={layersStyle.defaultTract} onEachFeature={onEachTract}/>
                        </FeatureGroup>
                    }
                </FeatureGroup>
            } */}
        </div>
    )
}

export default function Map({ geoJsonId, setGeoJsonId, selectedState, setSelectedState, selectedCounty, setSelectedCounty, showPolls, setShowPolls, showVD, setShowVD }: 
                            { geoJsonId: GeoID, setGeoJsonId: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any, showPolls: boolean, setShowPolls: any, showVD: boolean, setShowVD: any }): JSX.Element {

    const mapRef = useRef(null);

    return(
        <MapContainer
            className="home-map"
            center={[defaultMap.latlng.lat, defaultMap.latlng.lng]}
            zoom={defaultMap.zoom}
            minZoom={defaultMap.minZoom}
            maxZoom={defaultMap.maxZoom}
            scrollWheelZoom={false}
            zoomControl={false}
            ref={mapRef}
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <LayersComponent mapRef={mapRef} 
                            geoJsonId={geoJsonId} setGeoJsonId={setGeoJsonId}
                             selectedState={selectedState} setSelectedState={setSelectedState} 
                             selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty}
                             showPolls={showPolls} setShowPolls={setShowPolls}
                            showVD={showVD} setShowVD={setShowVD}
                             />
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
