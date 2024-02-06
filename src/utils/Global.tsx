// Libraries
import { LatLng } from "leaflet";
import { County, State} from "./Types"

export const selectVariable = {
    changeYear: [
                //  {id: '0', descr: 'Overall 2012 – 2022', baseYear: 2022, changeYear: 'Overall 2012 - 2022'},
                 {id: '1', descr: '2020 – 2022', baseYear: 2022, changeYear: '2020 - 2022', decennialCensusYear: 2020, ms: false, ga: true, wi: true, sc: true},
                 {id: '2', descr: '2018 – 2022', baseYear: 2022, changeYear: '2018 - 2022', decennialCensusYear: 2020, ms: true, ga: false, wi: false, sc: false},
                 {id: '3', descr: '2018 – 2020', baseYear: 2020, changeYear: '2018 - 2020', decennialCensusYear: 2020, ms: false, ga: true, wi: true, sc: true},
                 {id: '4', descr: '2016 – 2018', baseYear: 2018, changeYear: '2016 - 2018', decennialCensusYear: 2010, ms: true, ga: true, wi: true, sc: true},
                 {id: '5', descr: '2014 – 2016', baseYear: 2016, changeYear: '2014 - 2016', decennialCensusYear: 2010, ms: true, ga: false, wi: true, sc: true},
                 {id: '6', descr: '2012 – 2014', baseYear: 2014, changeYear: '2012 - 2014', decennialCensusYear: 2010, ms: true, ga: false, wi: true, sc: true}
                ],
    equityIndicator: [{variable: 'none', descr: 'None'},
                    //   {id: '', descr: 'Total # registered voters'},
                    //   {id: '', descr: '# registered voters per polling location'},
                      {variable: 'pctBlack', descr: '% Black'},
                    //   {id: '4', variable: '', descr: 'Age demographics'},
                      // {variable: 'population_density', descr: 'Population density'},
                    //   {id: '', descr: 'Nearest time to poll'}
                ],
    indicator: [{id: '0', descr: '# registered voters per polling location'},
                {id: '1', descr: '# polling locations'},
                {id: '2', descr: '# of poll location changes in last year'}]
}

export const outerBounds: [number, number][] = 
    [[5.499550, -167.276413], //Southwest
    [83.162102, -19]] //Northeast

export const defaultMap =  {geoid: '0',
                            name: 'United States',
                            type: 'US',
                            zoom: 5, 
                            latlng: {lat: 39.97, lng: -86.19} as LatLng,
                            minZoom: 4,
                            maxZoom: 18};

export const defaultCounty = {type: 'County',
                              stfp: '',
                              name:'',
                              cntyfp:'',
                              geoid:'',
                              latlng: {lat: 0, lng: 0}} as County;

export const defaultState = {type: 'State',
                             name:'', 
                             stfp:'',
                             latlng: defaultMap.latlng, 
                             zoom: 5,
                             abbr: '',
                             selected: false} as State;
