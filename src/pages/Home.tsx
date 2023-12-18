import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

import Main from '../components/Main';

export default function Home({}): JSX.Element {

    let navigate = useNavigate(); 
    const routeNext = () => {
      let path = `/Map`; 
      navigate(path);
    }

    return(
        <Main> 
            <Button variant="contained" onClick={routeNext}>Get started</Button>
        </Main>
    )
}