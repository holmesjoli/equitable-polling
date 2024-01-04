// Libraries
import { useEffect, useMemo, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Rectangle, FeatureGroup } from "react-leaflet";

// Components
import * as Tooltip from "./Tooltip";

// Types
import { State, County } from "../utils/Types";

// Global
import { defaultMap, outerBounds, defaultCounty, defaultState } from "../utils/Global";

// Data
import { unnestedTracts, unnestedCountyData, nestedStateData, updateSelectedCounty, getAdjacentTracts } from "../utils/DM";

// Styles 
import { layersStyle, highlightSelectedStyle } from "../utils/Theme";
import { FeatureCollection } from "geojson";

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

function LayersComponent({ setFullScreen, selectedState, setSelectedState, selectedCounty, setSelectedCounty }: 
                         { setFullScreen: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any}) {

    const map = useMap();
    const [mapBounds, setMapBounds] = useState(map.getBounds());

    const [countiesData, setCountiesData] = useState<GeoJSON.FeatureCollection>(unnestedCountyData);
    const geoJsonCountiesLayer = useRef<L.GeoJSON<any, any>>(null);

    // const [tractsData, setTractsData] = useState<GeoJSON.FeatureCollection>(unnestedTracts(selectedState));
    // const geoJsonTractsLayer = useRef<L.GeoJSON<any, any>>(null);

    // Functions ---------------------------------------------------

    function onEachState(_: any, layer: any) {
        layer.on({
          mouseover: mouseOver,
          mouseout: mouseOut,
          click: onClickState
        });
        Tooltip.pointerOut();
    }

    function onClickState(event: any) {
        var layer = event.target;
        setFullScreen(false);
        const clickedState = nestedStateData.features.find((d: GeoJSON.Feature) => d.properties!.stfp === layer.feature.properties.stfp)!.properties;
        setSelectedState(clickedState as State);
        setSelectedCounty(defaultCounty);

        map.flyTo(clickedState!.latlng, clickedState!.zoom);
        // setMapBounds(map.getBounds());
    }

    // function onEachCounty(_: any, layer: any) {
    //     layer.on({
    //       mouseover: mouseOver,
    //       mouseout: mouseOut,
    //       click: onClickCounty
    //     });
    // }

    // function onClickCounty(event: any) {
    //     var layer = event.target;
    //     updateSelectedCounty(selectedState, setSelectedState, layer.feature.properties.cntyfp);
    //     const clickedCounty = selectedState.counties.features.find(d => d.properties!.cntyfp === layer.feature.properties.cntyfp)!.properties;
    //     setSelectedCounty(clickedCounty as County);
    //     Tooltip.pointerOut();
    //     map.flyTo(clickedCounty!.latlng, clickedCounty!.zoom);
    //     setMapBounds(map.getBounds());
    // }

    // function onEachTract(_: any, layer: any) {
    //     layer.on({
    //       mouseover: mouseOverTract,
    //       mouseout: mouseOutTract
    //     });
    // }

    // React Hooks ---------------------------------------------------

    // on Click Rectangle - Resets the zoom and full screen to the us map
    const onClickRect = useMemo(
        () => ({
          click() {
            map.flyTo(defaultMap.center, defaultMap.zoom);
            setFullScreen(true);
            setSelectedState(defaultState);
            setMapBounds(map.getBounds());
          },
        }),
        [map]
    );

    // UseEffect for when the user selects a state from the query menu, and does not click on map
    useEffect(() => {
        map.flyTo(selectedState.latlng, selectedState.zoom);
        // setMapBounds(map.getBounds());
    }, [selectedState]);


    console.log(map.getBounds());
    console.log(mapBounds);

    // useEffect(() => {

    //     // setTractsData(getAdjacentTracts(selectedCounty));

    //     // if else add otherwise react finds the center of the world map in Africa
    //     if (selectedCounty.stfp !== "") {
    //         map.flyTo(selectedCounty.latlng, selectedCounty.zoom);
    //         setMapBounds(map.getBounds());
    //     } else {
    //         map.flyTo(selectedState.latlng, selectedState.zoom);
    //         setMapBounds(map.getBounds());
    //     }

    //     // Update the color of the county when county is updated
    //     map.eachLayer((layer) => {
    //         if ((layer as any).feature) {
    //             if ((layer as any).feature.properties.selected) {
    //                 (layer as any).setStyle(highlightSelectedStyle((layer as any).feature));
    //             }
    //         }
    //     });

    // }, [selectedCounty, selectedState]);

    // useEffect(() => {

    //     const ne = map.getBounds().getNorthEast();
    //     const sw = map.getBounds().getSouthWest();

    //     console.log(unnestedCountyData.features.filter((d: any) => (d.properties.bounds.northEast.lat < ne.lat) && 
    //                                                                (d.properties.bounds.northEast.lng < ne.lng) &&
    //                                                                (d.properties.bounds.southWest.lat > sw.lat) &&
    //                                                                (d.properties.bounds.southWest.lng > sw.lng)));
    // }, [mapBounds]);

    // useEffect(() => {
    //     if (geoJsonTractsLayer.current) {
    //         geoJsonTractsLayer.current?.clearLayers().addData(tractsData);
    //     }
    // }, [tractsData]);

    return(
        <div className="Layers">
            <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} eventHandlers={onClickRect}/>
            {selectedState.stfp === "" ?
                <GeoJSON key="state-geo-layer" data={nestedStateData} style={layersStyle.default} onEachFeature={onEachState} /> : 
                <FeatureGroup>
                    <GeoJSON key="state-geo-layer" data={nestedStateData} style={layersStyle.selected}/>
                    {/* {selectedCounty.cntyfp === "" ? 
                        <GeoJSON key="county-geo-layer" data={unnestedCountyData} style={layersStyle.default} onEachFeature={onEachCounty}/>
                    :
                        <FeatureGroup>
                            <GeoJSON key="county-geo-layer" data={unnestedCountyData} style={highlightSelectedStyle}/>
                            <GeoJSON key="tract-geo-layer" ref={geoJsonTractsLayer} data={tractsData} style={layersStyle.defaultTract} onEachFeature={onEachTract}/>
                        </FeatureGroup>
                    } */}
                </FeatureGroup>
            }
        </div>
    )
}

export default function Map({ setFullScreen, selectedState, setSelectedState, selectedCounty, setSelectedCounty }: 
                            { setFullScreen: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any }): JSX.Element {

    return(
        <MapContainer
            className="home-map"
            center={[defaultMap.center.lat, defaultMap.center.lng]}
            zoom={defaultMap.zoom}
            minZoom={defaultMap.minZoom}
            maxZoom={defaultMap.maxZoom}
            scrollWheelZoom={false}
            zoomControl={false}
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <LayersComponent setFullScreen={setFullScreen} selectedState={selectedState} setSelectedState={setSelectedState} selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty} />
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
