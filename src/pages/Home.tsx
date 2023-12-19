import { useRef } from "react";

import { useNavigate } from "react-router-dom";

// Libraries
import { MapContainer, TileLayer, Polygon, GeoJSON } from "react-leaflet";

// Components
import Main from '../components/Main';
import Status from '../components/Status';
import { PageDescription } from "../components/Query";
import states from "../data/states.json";

const style = { color: '#4FA5BC', pointer: 'cursor', fillOpacity: 0.4, weight: 2 };

export default function Home({}): JSX.Element {

    let navigate = useNavigate(); 
    const routeNext = () => {
      let path = `/Map`; 
      navigate(path);
    }

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
          mouseout: mouseOut
        //   click: onDrillDown
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

    // function resetHighlight(e: any) {
    //     geoJsonRef.current.leafletElement.resetStyle(e.target);
    // }

    // function zoomToFeature(e: any) {
    //     mapRef.current.leafletElement.fitBounds(e.target.getBounds());
    // }

    return(

        <div>
            <Status>
                <PageDescription>
                    <p>The goal of the Polling Equity Dashboard is to help users assess which communities could benefit from additional access to polling locations. The dashboard was designed by the <a href="https://www.newdata.org/" target="_blank">Center for New Data</a>, a non-partisan non-profit interested in using data to strengthen our democracy. <b>Select a state to get started.</b></p>
                </PageDescription>
            </Status>
            <Main> 
                <MapContainer
                    className="home-map"
                    center={[39.97, -86.19]}
                    zoom={5}
                    maxZoom={18}
                    >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <GeoJSON data={data} style={style} onEachFeature={onEachFeature}/>
            </MapContainer>
        </Main>
    </div>
    )
}