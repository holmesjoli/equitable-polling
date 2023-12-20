// Data Management Step
import statesGeo from "../data/stateGeoJSON.json";
import stateCounty from "../data/stateCounty.json";

import { State } from "./Types";
import { LatLng } from "leaflet";

export function formattedStateGeoJSON() {

    const features = [] as GeoJSON.Feature[];

    statesGeo.forEach((d: any) => {
        features.push({type: 'Feature', 
                       properties: {stname: d.stname, 
                                    stfp: d.stfp, 
                                    latlng: {lat: d.Y, lng: d.X} as LatLng, 
                                    counties: stateCounty.find((e: any) => e.stfp === d.stfp)!.counties,
                                    zoom: d.stfp == "45" ? 8: 7} as State, 
                       geometry: d.geometry as GeoJSON.Geometry})
    });

    const data = {type: 'FeatureCollection', features: features} as GeoJSON.FeatureCollection;

    return data;
}
