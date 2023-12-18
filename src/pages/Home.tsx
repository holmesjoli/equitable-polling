import { useNavigate } from "react-router-dom";

// Libraries
import { MapContainer, TileLayer } from "react-leaflet";

// Components
import Main from '../components/Main';

export default function Home({}): JSX.Element {

    let navigate = useNavigate(); 
    const routeNext = () => {
      let path = `/Map`; 
      navigate(path);
    }

    var maxBounds = [
        [5.499550, -167.276413], //Southwest
        [83.162102, -52.233040]  //Northeast
    ];

    return(
        <Main> 
            <MapContainer
                className="home-map"
                center={[39.82, -98.58]}
                zoom={5}
                maxZoom={18}
                >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
        </MapContainer>
    </Main>
    )
}