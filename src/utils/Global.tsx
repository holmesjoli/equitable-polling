// Libraries
import * as d3 from 'd3';
import { LatLng } from "leaflet";
import { County, State } from "./Types"

export const selectVariable = {
    changeYear: [{id: '0', descr: 'Overall 2012-2022', baseYear: 2022},
                 {id: '1', descr: '2018-2020', baseYear: 2020},
                 {id: '2', descr: '2016-2018', baseYear: 2018}],
    equityIndicator: [{id: '0', descr: 'None'},
                      {id: '1', descr: '% Black Voters'},
                      {id: '2', descr: 'Age demographics'},
                      {id: '3', descr: 'Nearest time to poll'}],
    indicator: [{id: '0', descr: '# polls per registered voters'},
                {id: '1', descr: '# polls'}],
}

export const layersStyle = {default: { color: '#757575', fillColor: "#FAF6F0", fillOpacity: 0.5, weight: 1, pointer: 'cursor' },
                            selected: { color: '#757575', fillColor: "#FAF6F0", fillOpacity: 0, weight: 2 },
                            highlight: { color: "#047391", fillColor: "#047391"},
                            greyOut: { color: '#EAEAEA', fillOpacity: 0.75, weight: 0 }
}

export const outerBounds: [number, number][] = 
    [[5.499550, -167.276413], //Southwest
    [83.162102, -19]] //Northeast

export const defaultMap = {zoom: 5, 
                           center: {lat: 39.97, lng: -86.19} as LatLng,
                           minZoom: 4,
                           maxZoom: 18};

// Scales
export const strokeColorScale = d3.scaleOrdinal()
  .domain(["increase", "nochange", "decrease"] )
  .range(["#610063", "#757575", "#E45729"] );

export const fillColorScale = d3.scaleOrdinal()
  .domain(['-3', '-2', '-1', '0', '1', '2', '3'] )
  .range(["#E45729", "#F28559", "#FBB18A", "#C6C6C6", "#C498A6", "#935485", "#610063"] );

export const rScale = d3.scaleSqrt()
  .domain([1, 30] )
  .range([3, 15] );

export const defaultCounty = {'stfp': '', 
                              'name':'', 
                              'cntyfp':'', 
                              'geoid':'', 
                              'tracts': {} as GeoJSON.FeatureCollection,
                              'adjacencies': [] as string[],
                              latlng: {lat: 0, lng: 0}} as County;

export const defaultState = {'name':'', 
                             'stfp':'', 
                             'counties': {} as GeoJSON.FeatureCollection, 
                             latlng: defaultMap.center, 
                             zoom: 5} as State;
