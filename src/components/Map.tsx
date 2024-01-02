// Libraries
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Rectangle } from "react-leaflet";

// Components
import * as Tooltip from "./Tooltip";

// Types
import { State } from "../utils/Types";

// Global
import { layersStyle, centerUS, outerBounds, defaultCounty } from "../utils/Global";

export function mouseOver(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.highlight);
    Tooltip.pointerOver(event.originalEvent.clientX, event.originalEvent.clientY, layer.feature.properties.name);
}

export function mouseOut(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.default.state);
    Tooltip.pointerOut();
}

function LayersComponent({ usData, isFullScreen, setFullScreen, selectedState, setState, setCounty }: { usData: GeoJSON.FeatureCollection, isFullScreen: boolean, setFullScreen: any, selectedState: State, setState: any, setCounty: any }) {
    const map = useMap();

    const countyDataAll = {type: 'FeatureCollection', features: [] as GeoJSON.Feature[]} as GeoJSON.FeatureCollection;

    usData.features.forEach((d: any) => {
        d.properties.counties.features.forEach((e: any) => {
            countyDataAll.features.push(e);
        });
    });

    // Functions ---------------------------------------------------

    function onEachState(_: any, layer: any) {
        layer.on({
          mouseover: mouseOver,
          mouseout: mouseOut,
          click: onClickState
        });
    }

    function onClickState(event: any) {
        var layer = event.target;
        setFullScreen(false);
        const clickedState = usData.features.find(d => d.properties!.stfp === layer.feature.properties.stfp)!.properties;
        setState(clickedState as State);
        setCounty(defaultCounty);

        map.flyTo(clickedState!.latlng, clickedState!.zoom);
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
    }

    // React Hooks ---------------------------------------------------

    // on Click Rectange - Resets the zoom and full screen to the us map
    const onClickRect = useMemo(
        () => ({
          click() {
            map.flyTo(centerUS, 5);
            setFullScreen(true);
          },
        }),
        [map]
    ); 

    useEffect(() => {
        map.flyTo(selectedState.latlng, selectedState.zoom);
    }, [selectedState]);

    return(
        <div className="Layers">
            <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} eventHandlers={onClickRect}/>
            <GeoJSON data={usData} style={layersStyle.default.state} onEachFeature={onEachState} /> 
            {isFullScreen ? <></> : <GeoJSON data={countyDataAll} style={layersStyle.default.county} onEachFeature={onEachCounty}/> }
        </div>
    )
}

export default function Map({ usData, isFullScreen, setFullScreen, selectedState, setState, setCounty }: { usData: GeoJSON.FeatureCollection, isFullScreen: boolean, setFullScreen: any, selectedState: State, setState: any, setCounty: any }): JSX.Element {

    return(
        <MapContainer
            className="home-map"
            center={[centerUS.lat, centerUS.lng]}
            zoom={5}
            minZoom={4}
            maxZoom={18}
            scrollWheelZoom={false}
            zoomControl={false}
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <LayersComponent usData={usData} isFullScreen={isFullScreen} setFullScreen={setFullScreen} selectedState={selectedState} setState={setState} setCounty={setCounty}/>
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
