// Components
import { Navigation } from "../components/Navigation";
import Footer from "../components/Footer";

export default function Trends({}): JSX.Element {

    return(
        <div className="Main">
            <div className="Content">
                <Navigation />               
            </div>
            <Footer/>
        </div>
    );
}
