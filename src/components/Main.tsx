import { Navigation } from '../components/Navigation';
import  Footer from '../components/Footer';

export default function Main({children}: {children: any}): JSX.Element {

    return(
        <div>
            <Navigation />
            {children}
            <Footer />
        </div>
    )
}
