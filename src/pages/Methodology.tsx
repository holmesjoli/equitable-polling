//Libraries
import { useEffect } from 'react';
import * as d3 from 'd3';

// Components
import Main from '../components/Main';

export default function Methodology({}): JSX.Element {

    useEffect(() => {
        d3.select('body').style('overflow', 'scroll');
    }, []);

    return(
        <Main>
             {<div className="Informational-Content">
                <h2>Methodology</h2>
                <div className="Inner-h3">
                    <h3>Data Sources</h3>
                    {/* <p>To create the ${appTitle}, the team identified multiple data sources and created a data pipeline to clean and aggregate the data.</p> */}
                        <div className="Inner-h4">
                            <h4>Geographic Boundary Data</h4>
                            <ul>
                                <li><a className="SemiBold" href="https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html">TIGER</a> files maintained by the US Census Bureau</li>
                            </ul>
                        </div>
                        <div className="Inner-h4">
                            <h4>Demographic Data</h4>
                            <ul>
                                <li><a className="SemiBold" href="https://www.census.gov/programs-surveys/acs/data.html">American Community Survey (ACS)</a> files maintained by the US Census Bureau</li>
                            </ul>
                        </div>
                        <div className="Inner-h4">
                            <h4>Polling Location Data</h4>
                            <ul>
                                <li><a className="SemiBold" href="https://publicintegrity.org/">The Center for Public Integrity (CPI)</a></li>
                                <li><a className="SemiBold" href="https://www.democracy.works/">Democracy Works (DW)</a></li>
                            </ul>
                        </div>
                </div>
                <div className="Inner-h3">
                    <h3>Data Availablity</h3>
                    <div className="Inner-h4">
                        <h4>Geographic Boundaries</h4>
                        <p>Although county boundaries stay fairly static year-over-year, the Census Bureau updates census tract geographies when the 
                            decennial census is updated. For this reason, years 2012 – 2018 rely on census tract geographies from 2010, and years 2020 
                            and 2022 rely on census tract geographies from 2020.</p>
                    </div>
                    <div className="Inner-h4">
                        <h4>Polling Location Data</h4>
                        <table>
                            <tbody>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td>2012</td>
                                    <td>2014</td>
                                    <td>2016</td>
                                    <td>2018</td>
                                    <td>2020</td>
                                    <td>2022</td>
                                </tr>
                                <tr>
                                    <td>Georgia</td>
                                    <td className="NA">NA</td>
                                    <td className="NA">NA</td>
                                    <td>CPI</td>
                                    <td>CPI</td>
                                    <td>CPI</td>
                                    <td>DW</td>
                                </tr>
                                <tr>
                                    <td>Mississippi</td>
                                    <td>CPI</td>
                                    <td>CPI</td>
                                    <td>CPI</td>
                                    <td>CPI</td>
                                    <td className="NA">NA</td>
                                    <td>DW</td>
                                </tr>
                                <tr>
                                    <td>South Carolina</td>
                                    <td>CPI</td>
                                    <td>CPI</td>
                                    <td>CPI</td>
                                    <td>CPI</td>
                                    <td>CPI</td>
                                    <td>DW</td>
                                </tr>
                                <tr>
                                <td>Wisconsin</td>
                                <td>CPI</td>
                                <td>CPI</td>
                                <td>CPI</td>
                                <td>CPI</td>
                                <td>CPI</td>
                                <td>DW</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="Inner-h3">
                    <h3>Data Caveats</h3>
                    <div className="Inner-h4">
                        <h4>Missing Data and Data Aggregations</h4>
                        <ul>
                            <li><span className="SemiBold">Mississippi</span> is missing data polling location data from 2020, necessitating change calculations between 2018 and 2022.</li>
                            <li><span className="SemiBold">Georgia</span> is missing polling location data for 2012 and 2014.</li>
                        </ul>
                    </div>
                    <div className="Inner-h4">
                        <h4>Polling Location Matching</h4>
                        <p>Polling locations are challenging to track because there is no systematic authority, government or otherwise, that tracks 
                            the locations year-over-year. Individual counties report polling locations to data aggregators like L2, however, there may 
                            be inconsistencies in the names of the locations and the exact latitudes and longitudes in the raw data.</p>
                        <p>To address these inconsistencies, our team at the Center for New Data used a method called <span className="Italic">fuzzy logic matching</span> to identify 
                            which polling locations were used year-over-year, and polling locations that were added or removed. The Center for New Data 
                            is confident in this data cleaning and matching approach, however, there is room for some error.</p>
                    </div>
                </div>
              </div>}
        </Main>
    )
}