import { Navigation } from '../components/Navigation';
import  Footer from '../components/Footer';

export default function Main({children}: {children: React.ReactNode}): JSX.Element {

    return(
        <div className="Main">
             <Navigation />
            {/* <div className="Content"> */}
                {children}
            {/* </div> */}
            <Footer />
        </div>
    )
}
