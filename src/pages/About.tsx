//Libraries
import { useEffect } from 'react';
import * as d3 from 'd3';

// Components
import Main from '../components/Main';

import { appTitle } from '../utils/Global';

export default function About({}): JSX.Element {

    useEffect(()=>{
        d3.select('body').style('overflow', 'hidden');
    }, []);

    return(
        <Main>
            {<div className="Informational-Content">
                <h2>About</h2>
                <div className="Inner-h3">
                    <h3>{appTitle}</h3>
                    <p>The {appTitle} aggregates data sources to empower voting rights organizations to defend and advocate for United States voters. 
                    The interactive visualization provides organizations with summarized and detailed information about where polling locations have been 
                    opened and closed in select states over the last decade so that voter advocacy organizations can fight for equitable access to polling 
                    locations. The data visualization incorporates additional equity information such as racial breakdown, poverty level (coming soon!), 
                    and disability status (coming soon!) so that voting advocates can target impact toward the most disenfranchised groups.</p>
                </div>
                <div className="Inner-h3">
                    <h3><a href="https://www.newdata.org/">The Center for New Data</a></h3>
                    <p><a href="https://www.newdata.org/">The Center for New Data</a> is a technology non-profit using data-driven insights to protect democracy. We partner with civic, academic, 
                        media and technology organizations to develop meaningful data products that drive social impact.</p>
                    <p>Our Polling Equity products provide the data voting rights advocates need to address problems like long lines at the ballot box 
                        and voting access disparities. Equipped with the right analytics, they work with local election officials to ensure polling locations 
                        are distributed equitably in their communities and support litigation action [under the Voting Rights Act] when voters encounter 
                        systemic challenges at the polls.</p>
                </div>
            </div>}
        </Main>
    )
}