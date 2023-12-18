import { MainNavigation } from '../components/Navigation';
import  Footer from '../components/Footer';

export default function Main({children}: {children: any}): JSX.Element {

    return(
        <div>
            <MainNavigation />
            {children}
            <Footer />
        </div>
    )
}
