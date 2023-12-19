// Libraries
import { useRef, useState, useMemo } from "react";

// Components
import Main from '../components/Main';
import { StateStatus, USStatus } from '../components/Status';
import { QueryMenu } from "../components/Query";
import Map from "../components/Map";
import { formattedGeoJSON } from "../utils/DM";

// Data 
import { changeYearData, equityIndicatorData } from "../utils/Global";

// Setup data for GeoJSON

const outerBounds = [
    [5.499550, -167.276413], //Southwest
    [83.162102, -52.233040]  //Northeast
];

// Data Management
const data = formattedGeoJSON();

export default function Home({}): JSX.Element {

    const [state, setState] = useState({'stname':'', 'stfp':'', 'counties':[], centroid: {lat: 0, long: 0}});
    const [county, setCounty] = useState({'cntyname':'', 'cntyfp':'', 'cntygeoid':''});
    const [changeYear, setChangeYear] = useState(changeYearData[0]);
    const [equityIndicator, setEquityIndicator] = useState(equityIndicatorData[0]);
    const [isFullScreen, setFullScreen] = useState(true);
    const [bounds, setBounds] = useState(outerBounds);

    // console.log(bounds);

    const handleFullScreen = () => {
        // if (isFullScreen) {
        // } else {
        // }
        setFullScreen(!isFullScreen);
    };

    return(
        <Main>
            {isFullScreen? <USStatus /> : <StateStatus equityIndicator={equityIndicator} setEquityIndicator={setEquityIndicator} />}
            <QueryMenu data={data} isFullScreen={isFullScreen} changeYear={changeYear} setChangeYear={setChangeYear} state={state} setState={setState} county={county} setCounty={setCounty}/>
            <Map data={data} setFullScreen={setFullScreen} setState={setState} setBounds={setBounds}/>
        </Main>
    )
}
