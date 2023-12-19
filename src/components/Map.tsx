// Libraries
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from "react-leaflet";

import { State } from "../utils/Types";

import { style } from "../utils/Global";

export function mouseOver(event: any) {
    var layer = event.target;
    layer.setStyle({
        color: "#047391",
        fillOpacity: 0.7
    });
}

export function mouseOut(event: any) {
    var layer = event.target;
    layer.setStyle(style);
}


function MyComponent({ data, setFullScreen, setState, setBounds }: { data: GeoJSON.FeatureCollection, setFullScreen: any, setState: any, setBounds: any }) {
    const map = useMap();

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

        const innerBounds = event.target.getBounds();
        setBounds(innerBounds);
        map.fitBounds(innerBounds);
    }

    return(
        <GeoJSON data={data} style={style} onEachFeature={onEachFeature}/>
    )

}

export default function Map({ data, setFullScreen, setState, setBounds }: { data: GeoJSON.FeatureCollection, setFullScreen: any, setState: any, setBounds: any }): JSX.Element {

    return(
        <MapContainer
            className="home-map"
            center={[39.97, -86.19]}
            zoom={5}
            maxZoom={18}
            scrollWheelZoom={false}
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <MyComponent data={data} setFullScreen={setFullScreen} setState={setState} setBounds={setBounds}/>
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}