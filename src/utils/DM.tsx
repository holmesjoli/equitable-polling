// Data Management Step
import statesGeo from "../data/stateGeoJSON.json";
import usGeo from "../data/usGeoJSON.json";
import stateCounty from "../data/stateCounty.json";

console.log(usGeo);

import { State } from "./Types";
import { LatLng } from "leaflet";

export function formattedStateGeoJSON() {

    const features = [] as GeoJSON.Feature[];

    statesGeo.forEach((d: any) => {
        features.push({type: 'Feature', 
                       properties: {stname: d.stname, 
                                    stfp: d.stfp, 
                                    latlng: {lat: d.Y, lng: d.X} as LatLng, 
                                    counties: stateCounty.find((e: any) => e.stfp === d.stfp)!.counties} as State, 
                       geometry: d.geometry as GeoJSON.Geometry})
    });

    const data = {type: 'FeatureCollection', features: features} as GeoJSON.FeatureCollection;

    return data;
}

export function formattedUSGeoJSON() {

    const features = [] as GeoJSON.Feature[];

    usGeo.forEach((d: any) => {
        features.push({type: 'Feature', 
                       properties: {},
                       geometry: d.geometry as GeoJSON.Geometry})
    });

    const data = {type: 'FeatureCollection', features: features} as GeoJSON.FeatureCollection;

    return data;
}
