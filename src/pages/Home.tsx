// Libraries
import { useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";

// Components
import Main from '../components/Main';
import { StateStatus, USStatus } from '../components/Status';
import { QueryMenu } from "../components/Query";

// Data 
import { changeYearData, equityIndicatorData } from "../utils/Global";
import states from "../data/states.json";
import geoData from "../data/geoData.json";

// Types
import { State } from "../utils/Types";

const style = { color: '#4FA5BC', pointer: 'cursor', fillOpacity: 0.4, weight: 2 };

export default function Home({}): JSX.Element {

    const [state, setState] = useState({'stname':'', 'stfp':'', 'counties':[]});
    const [county, setCounty] = useState({'cntyname':'', 'cntyfp':'', 'cntygeoid':''});
    const [changeYear, setChangeYear] = useState(changeYearData[0]);
    const [equityIndicator, setEquityIndicator] = useState(equityIndicatorData[0]);
    const [isFullScreen, setFullScreen] = useState(true);

    var mapRef = useRef(null);

    // var maxBounds = [
    //     [5.499550, -167.276413], //Southwest
    //     [83.162102, -52.233040]  //Northeast
    // ];

    const handleFullScreen = () => {
        // if (isFullScreen) {
        // } else {
        // }
        setFullScreen(!isFullScreen);
      };

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

    function mouseOver(event: any) {
        var layer = event.target;
        layer.setStyle({
            color: "#047391",
            fillOpacity: 0.7
        });
    }

    function mouseOut(event: any) {
        var layer = event.target;
        layer.setStyle(style);
    }

    function onClick(event: any) {
        var layer = event.target;
        setFullScreen(false);
        setState(geoData.find(d => d.stfp === layer.feature.properties.stfp) as any);
    }

    return(
        <Main>
            {isFullScreen? <USStatus /> : <StateStatus equityIndicator={equityIndicator} setEquityIndicator={setEquityIndicator} />}
            <QueryMenu isFullScreen={isFullScreen} changeYear={changeYear} setChangeYear={setChangeYear} state={state} setState={setState} county={county} setCounty={setCounty}/>
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
