// Libraries
import { LatLng } from "leaflet";
import { County, State, GeoID } from "./Types"

export const selectVariable = {
    changeYear: [{id: '0', descr: 'Overall 2012 – 2022', baseYear: 2022},
                 {id: '1', descr: '2018 – 2020', baseYear: 2020},
                 {id: '2', descr: '2016 – 2018', baseYear: 2018}],
    equityIndicator: [{id: '0', descr: 'None'},
                      {id: '1', descr: '% Black Voters'},
                      {id: '2', descr: 'Age demographics'},
                      {id: '3', descr: 'Nearest time to poll'}],
    indicator: [{id: '0', descr: '# polls per registered voters'},
                {id: '1', descr: '# polls'}],
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
                            maxZoom: 18} as GeoID;

export const defaultCounty = {'type': 'County',
                              'stfp': '', 
                              'name':'', 
                              'cntyfp':'', 
                              'geoid':'', 
                              'tracts': {} as GeoJSON.FeatureCollection,
                              'adjacencies': [] as string[],
                              latlng: {lat: 0, lng: 0}} as County;

export const defaultState = {'type': 'State',
                             'name':'', 
                             'stfp':'', 
                             'counties': {} as GeoJSON.FeatureCollection, 
                             latlng: defaultMap.latlng, 
                             zoom: 5} as State;
