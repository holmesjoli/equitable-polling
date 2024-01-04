// Libraries
import { LatLng, LatLngBounds } from "leaflet";
import { County, State, Bounds } from "./Types"

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
    [[9.96885060854611, -170.59570312500003], //Southwest
    [60.930432202923335, -1.8457031250000002]] //Northeast

export const defaultMap = {zoom: 5, 
                           center: {lat: 39.97, lng: -86.19} as LatLng,
                           minZoom: 4,
                           maxZoom: 18};

export const defaultCounty = {'type': 'County',
                              'stfp': '', 
                              'name':'', 
                              'cntyfp':'', 
                              'geoid':'', 
                              'tracts': {} as GeoJSON.FeatureCollection,
                              'adjacencies': [] as string[],
                              latlng: {lat: 0, lng: 0} as LatLng,
                              bounds: {} as Bounds} as County;

export const defaultState = {'type': 'State',
                             'name':'', 
                             'stfp':'', 
                             'counties': {} as GeoJSON.FeatureCollection, 
                             latlng: defaultMap.center, 
                             zoom: defaultMap.zoom} as State;
