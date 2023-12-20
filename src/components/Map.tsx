// Libraries
import { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Rectangle } from "react-leaflet";

// Types
import { State } from "../utils/Types";

// Global
import { layersStyle, centerUS, outerBounds } from "../utils/Global";

export function mouseOver(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.highlight);
}

export function mouseOut(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.default);
}

function LayersComponent({ data, setFullScreen, state, setState, setBounds }: { data: GeoJSON.FeatureCollection, setFullScreen: any, state: State, setState: any, setBounds: any }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(state.latlng, map.getZoom())
    }, [state])

    function onEachFeature(_: any, layer: any) {
        layer.on({
          mouseover: mouseOver,
          mouseout: mouseOut,
          click: onClick
        });
    }

    function onClick(event: any) {
        var layer = event.target;
        setFullScreen(false);
        setState(data.features.find(d => d.properties!.stfp === layer.feature.properties.stfp)!.properties as State);

        const innerBounds = layer.getBounds();
        console.log(event);
        console.log(innerBounds);
        setBounds(innerBounds);
        map.fitBounds(innerBounds);
    }

    return(
        <div className="Layers">
            <GeoJSON data={data} style={layersStyle.default} onEachFeature={onEachFeature}/> 
        </div>
    )
}

export default function Map({ data, setFullScreen, state, setState, setBounds }: { data: GeoJSON.FeatureCollection, setFullScreen: any, state: State, setState: any, setBounds: any }): JSX.Element {

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
            <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} />
            <LayersComponent data={data} setFullScreen={setFullScreen} state={state} setState={setState} setBounds={setBounds}/>
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}