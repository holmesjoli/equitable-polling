// Libraries
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Rectangle, Tooltip } from "react-leaflet";

// Types
import { State } from "../utils/Types";

// Global
import { layersStyle, centerUS, outerBounds, defaultCounty } from "../utils/Global";

export function mouseOver(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.highlight);
}

export function mouseOut(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.default.state);
}

function LayersComponent({ usData, isFullScreen, setFullScreen, state, setState, setCounty }: { usData: GeoJSON.FeatureCollection, isFullScreen: boolean, setFullScreen: any, state: State, setState: any, setCounty: any }) {
    const map = useMap();

    const countyDataAll = {type: 'FeatureCollection', features: [] as GeoJSON.Feature[]} as GeoJSON.FeatureCollection;

    usData.features.forEach((d: any) => {
        d.properties.counties.features.forEach((e: any) => {
            countyDataAll.features.push(e);
        });
    });

    useEffect(() => {
        map.flyTo(state.latlng, state.zoom);
    }, [state]);

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

    const onClickRect = useMemo(
        () => ({
          click() {
            map.flyTo(centerUS, 5);
            setFullScreen(true);
          },
        }),
        [map]
    );

    return(
        <div className="Layers">
            <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} eventHandlers={onClickRect}/>
            <GeoJSON data={usData} style={layersStyle.default.state} onEachFeature={onEachState}> 
                <Tooltip sticky>{state.stname}</Tooltip>
            </GeoJSON>
            {isFullScreen ? <></> : <GeoJSON data={countyDataAll} style={layersStyle.default.county} /> }
        </div>
    )
}

export default function Map({ usData, isFullScreen, setFullScreen, state, setState, setCounty }: { usData: GeoJSON.FeatureCollection, isFullScreen: boolean, setFullScreen: any, state: State, setState: any, setCounty: any }): JSX.Element {

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
            <LayersComponent usData={usData} isFullScreen={isFullScreen} setFullScreen={setFullScreen} state={state} setState={setState} setCounty={setCounty}/>
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
