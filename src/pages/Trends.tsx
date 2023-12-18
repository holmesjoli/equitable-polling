// Components
import { PageNavigation } from "../components/Navigation";
import Footer from "../components/Footer";

export default function Trends({}): JSX.Element {

    return(
        <div className="Main">
            <div className="Content">
                <PageNavigation />
                <Footer/>
            </div>
        </div>
    );
}
