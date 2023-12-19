// Libraries
import { useRef, useState, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from "react-leaflet";

// Components
import Main from '../components/Main';
import { StateStatus, USStatus } from '../components/Status';
import { QueryMenu } from "../components/Query";
import { mouseOver, mouseOut } from "../components/Map";

// Data 
import { style, changeYearData, equityIndicatorData } from "../utils/Global";
import states from "../data/states.json";
import geoData from "../data/geoData.json";

// Setup data for GeoJSON
const features = [] as GeoJSON.Feature[];

states.forEach((d: any) => {
    features.push({type: 'Feature', 
                   properties: {name: d.name, stfp: d.stfp, centroid: {lat: d.Y, long: d.X}}, 
                   geometry: d.geometry})
});

const featuresCollection = {type: 'FeatureCollection', features: features} as GeoJSON.FeatureCollection;

const outerBounds = [
    [5.499550, -167.276413], //Southwest
    [83.162102, -52.233040]  //Northeast
];

export default function Home({}): JSX.Element {

    const [state, setState] = useState({'stname':'', 'stfp':'', 'counties':[]});
    const [county, setCounty] = useState({'cntyname':'', 'cntyfp':'', 'cntygeoid':''});
    const [changeYear, setChangeYear] = useState(changeYearData[0]);
    const [equityIndicator, setEquityIndicator] = useState(equityIndicatorData[0]);
    const [isFullScreen, setFullScreen] = useState(true);
    const [bounds, setBounds] = useState(outerBounds);

    console.log(bounds);

    // const map = useMap();

    // const innerHandlers = useMemo(
    //     () => ({
    //       click() {
    //         setBounds(innerBounds)
    //         map.fitBounds(innerBounds)
    //       },
    //     }),
    //     [map],
    //   )

    const handleFullScreen = () => {
        // if (isFullScreen) {
        // } else {
        // }
        setFullScreen(!isFullScreen);
    };

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

        console.log(bounds)
        // map.fitBounds(innerBounds)
    }

    function MyComponent() {
        const map = useMap()
        console.log('map center:', map.getCenter())
        return null
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
                scrollWheelZoom={false}
                >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <GeoJSON data={featuresCollection} style={style} onEachFeature={onEachFeature}/>
                <ZoomControl position="bottomright" />
            </MapContainer>
    </Main>
    )
}
