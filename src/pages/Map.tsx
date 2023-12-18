import React from "react";

// Components
import { PageNavigation } from "../components/Navigation";
import { PageDescription, SelectGeography, SelectChangeYear } from "../components/Query";
import Footer from "../components/Footer";

import { changeYearData } from "../utils/Global";

export default function Map({}): JSX.Element {

    const [state, setState] = React.useState({'stname':'', 'stfp':'', 'counties':[]});
    const [county, setCounty] = React.useState({'cntyname':'', 'cntyfp':'', 'cntygeoid':''});
    const [changeYear, setChangeYear] = React.useState(changeYearData[0]);

    return(
        <div className="Main">
            <div className="Content">
                <PageNavigation />
                <div className="Query">
                    <PageDescription>
                        <p>The mapping page shows an overview of how polling locations have changed over the last decade. Click a specific county to return a more detailed view.</p>
                    </PageDescription>
                    <SelectChangeYear changeYear={changeYear} setChangeYear={setChangeYear} />
                    <SelectGeography state={state} setState={setState} county={county} setCounty={setCounty} />
                </div>
                <Footer/>
            </div>
        </div>
    );
}
