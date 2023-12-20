import { LatLng } from "leaflet";

export const changeYearData = [{id: '0', descr: 'Overall 2012-2022', baseYear: 2022},
                               {id: '1', descr: 'Overall 2018-2020', baseYear: 2020},
                               {id: '2', descr: 'Overall 2016-2018', baseYear: 2018}];

export const equityIndicatorData = [{id: '0', descr: 'None'},
                                    {id: '1', descr: '% Black Voters'},
                                    {id: '2', descr: 'Age demographics'},
                                    {id: '3', descr: 'Nearest time to poll'}];

export const layersStyle = {defaultStyle: { color: '#757575', fillColor: "#FAF6F0", pointer: 'cursor', fillOpacity: 0.7, weight: 2 },
                            highlightStyle: { color: "#047391", fillColor: "#047391"},
                            greyOutStyle: { color: '#D7D7D7', fillOpacity: 0.7, weight: 0 }
}

export const centerUS = {lat: 39.97, lng: -86.19} as LatLng;