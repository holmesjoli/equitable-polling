import { LatLng } from "leaflet";

export const selectVariable = {
    changeYear: [{id: '0', descr: 'Overall 2012-2022', baseYear: 2022},
                 {id: '1', descr: 'Overall 2018-2020', baseYear: 2020},
                 {id: '2', descr: 'Overall 2016-2018', baseYear: 2018}],
    equityIndicator: [{id: '0', descr: 'None'},
                      {id: '1', descr: '% Black Voters'},
                      {id: '2', descr: 'Age demographics'},
                      {id: '3', descr: 'Nearest time to poll'}],
    indicator: [{id: '0', descr: '# polls per registered voters'},
                {id: '1', descr: '# polls'}],
}

export const layersStyle = {default: { color: '#757575', fillColor: "#FAF6F0", pointer: 'cursor', fillOpacity: 0.7, weight: 2 },
                            highlight: { color: "#047391", fillColor: "#047391"},
                            greyOut: { color: '#D7D7D7', fillOpacity: 0.6, weight: 0 }
}

export const outerBounds: [number, number][] = 
    [[5.499550, -167.276413], //Southwest
    [83.162102, -52.233040]] //Northeast

export const centerUS = {lat: 39.97, lng: -86.19} as LatLng;
