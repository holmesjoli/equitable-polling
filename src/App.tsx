// React dependencies
import {
  Routes,
  Route,
  HashRouter
} from 'react-router-dom';

import Home from './pages/Home';
import Map from './pages/Map';
import Methodology from './pages/Methodology';
import About from './pages/About';

export default function App({}): JSX.Element {

    return(
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Methodology" element={<Methodology />} />
                <Route path="/About" element={<About />} />
                <Route path="/Map" element={<Map />} />
            </Routes>
        </HashRouter>
    );
}
