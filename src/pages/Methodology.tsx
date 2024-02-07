import Main from '../components/Main';

export default function Methodology({}): JSX.Element {

    return(
        <Main>
             {<div className="Informational-Content">
                <h2>Methodology</h2>
                <div className="Inner-h3">
                    <h3>Data Sources</h3>
                    <p>To create the Polling Equity Dashboard, the team identified multiple data sources and created a data pipeline to clean and aggregate the data for the application.</p>
                        <div className="Inner-h4">
                            <h4>Geographic Boundary Data</h4>
                            <ul>
                                <li><a className="SemiBold" href="https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html">TIGER</a> files maintained by the US Census Bureau</li>
                            </ul>
                        </div>
                        <div className="Inner-h4">
                            <h4>Demographic data</h4>
                            <ul>
                                <li><a className="SemiBold" href="https://www.census.gov/programs-surveys/acs/data.html">American Community Survey (ACS)</a> files maintained by the US Census Bureau</li>
                            </ul>
                        </div>
                        <div className="Inner-h4">
                            <h4>Polling Location Data</h4>
                        </div>
                </div>
                <div className="Inner-h3">
                    <h3>Data Caveats</h3>
                    <div className="Inner-h4">
                        <h4>Geographical Changes</h4>
                        <p>Although county boundaries stay fairly static year-over-year, the Census Bureau updates census tract geographies when the 
                            decennial census is updated. For this reason, years 2012 – 2018 rely on census tract geographies from 2010, and years 2020 
                            and 2022 rely on census tract geographies from 2020.</p>
                    </div>
                    <div className="Inner-h4">
                        <h4>Polling Location Data</h4>
                        <p>Polling locations are challenging to track because there is no systematic authority, government or otherwise, that tracks 
                            the locations year-over-year. Individual counties report polling locations to data aggregators like L2, however, there may 
                            be inconsistencies in the names of the locations and the exact latitudes and longitudes in the raw data.</p>
                        <p>To address these inconsistencies, our team at the Center for New Data used a method called <span className="Italic">fuzzy logic matching</span> to identify 
                            which polling locations were used year-over-year, and polling locations that were added or removed. The Center for New Data 
                            is confident in this data cleaning and matching approach, however, there is room for some error.</p>
                    </div>
                    <div className="Inner-h4">
                        <h4>Missing Data</h4>
                        <p>The team encountered some instances of missing data for specific states.</p>
                        <ul>
                            <li><span className="SemiBold">Mississippi</span> is missing data polling location data from 2020</li>
                            <li><span className="SemiBold">Georgia</span> is missing polling location data for 2012 and 2014</li>
                        </ul>
                    </div>
                </div>
              </div>}
        </Main>
    )
}