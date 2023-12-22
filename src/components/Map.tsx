// Libraries
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Rectangle } from "react-leaflet";

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
    layer.setStyle(layersStyle.default);
}

function LayersComponent({ data, setFullScreen, state, setState, setCounty }: { data: GeoJSON.FeatureCollection, setFullScreen: any, state: State, setState: any, setCounty: any }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(state.latlng, state.zoom);
    }, [state])

    function onEachFeature(_: any, layer: any) {
        layer.on({
          mouseover: mouseOver,
          mouseout: mouseOut,
          click: onClickState
        });
    }

    function onClickState(event: any) {
        var layer = event.target;
        setFullScreen(false);
        const clickedState = data.features.find(d => d.properties!.stfp === layer.feature.properties.stfp)!.properties;
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
    )

    return(
        <div className="Layers">
            <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} eventHandlers={onClickRect}/>
            <GeoJSON data={data} style={layersStyle.default} onEachFeature={onEachFeature}/> 
        </div>
    )
}

export default function Map({ data, setFullScreen, state, setState, setCounty }: { data: GeoJSON.FeatureCollection, setFullScreen: any, state: State, setState: any, setCounty: any }): JSX.Element {

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
            <LayersComponent data={data} setFullScreen={setFullScreen} state={state} setState={setState} setCounty={setCounty}/>
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
