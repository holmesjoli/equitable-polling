// Libraries
import React, { useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import * as d3 from 'd3';

// Components
import Main from '../components/Main';
import { StateStatus, USStatus } from '../components/Status';
import states from "../data/states.json";

const style = { color: '#4FA5BC', pointer: 'cursor', fillOpacity: 0.4, weight: 2 };

export default function Home({}): JSX.Element {

    var mapRef = useRef(null);
    const [geographicView, setGeographicView] = React.useState("US");

    // var maxBounds = [
    //     [5.499550, -167.276413], //Southwest
    //     [83.162102, -52.233040]  //Northeast
    // ];

    const data: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: states.features as GeoJSON.Feature[]
    };

    function onEachFeature(_: any, layer: any) {
        layer.on({
          mouseover: mouseOver,
          mouseout: mouseOut,
          click: onClick
        });
    }

    function mouseOver(e: any) {
        var layer = e.target;
        layer.setStyle({
            color: "#047391",
            fillOpacity: 0.7
        });
    }

    function mouseOut(e: any) {
        var layer = e.target;
        layer.setStyle(style);
    }

    function onClick(e: any) {
        // var layer = e.target;
        // console.log(layer);
        // console.log(e.target.getBounds());
        setGeographicView("State");
    }

    return(
        <Main>
            {geographicView === "US"? <USStatus /> : <StateStatus />}
            <MapContainer
                className="home-map"
                center={[39.97, -86.19]}
                zoom={5}
                maxZoom={18}
                ref={mapRef}
                >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <GeoJSON data={data} style={style} onEachFeature={onEachFeature}/>
            <ZoomControl position="bottomright" />
        </MapContainer>
    </Main>
    )
}