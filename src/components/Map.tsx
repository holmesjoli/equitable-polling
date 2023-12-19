// Libraries
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from "react-leaflet";

// Data
import states from "../data/states.json";
import geoData from "../data/geoData.json";

import { style} from "../utils/Global";

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

const features = [] as GeoJSON.Feature[];

states.forEach((d: any) => {
    features.push({type: 'Feature', 
                   properties: {name: d.name, stfp: d.stfp, centroid: {lat: d.Y, long: d.X}}, 
                   geometry: d.geometry})
});

const featuresCollection = {type: 'FeatureCollection', features: features} as GeoJSON.FeatureCollection;


export default function Map({ setFullScreen, setState, setBounds }: { setFullScreen: any, setState: any, setBounds: any }): JSX.Element {

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
        setState(geoData.find(d => d.stfp === layer.feature.properties.stfp) as any);

        const innerBounds = event.target.getBounds();
        setBounds(innerBounds);

        // console.log(bounds)
        // map.fitBounds(innerBounds)
    }

    // function MyComponent() {
    //     const map = useMap()
    //     console.log('map center:', map.getCenter())
    //     return null
    // }

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
            <GeoJSON data={featuresCollection} style={style} onEachFeature={onEachFeature}/>
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}