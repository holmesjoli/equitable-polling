// Data Management Step
import statesGeo from "../data/stateGeoJSON.json";
import countiesGeo from "../data/countyGeoJSON.json";  

import { State, County } from "./Types";
import { LatLng } from "leaflet";

export function formattedStateGeoJSON() {

    const stateFeatures = [] as GeoJSON.Feature[];

    statesGeo.forEach((e: any) => {

        const countyFeatures = [] as GeoJSON.Feature[];

        countiesGeo.filter((d: any) => d.stfp === e.stfp).forEach((d: any) => {
            countyFeatures.push({type: 'Feature', 
                properties: {name: d.cntyname, 
                             cntyfp: d.cntyfp, 
                             cntygeoid: d.cntygeoid, 
                             latlng: {lat: d.Y, lng: d.X} as LatLng} as County, 
                geometry: d.geometry as GeoJSON.Geometry})
        });
        
        const countyData = {type: 'FeatureCollection', features: countyFeatures} as GeoJSON.FeatureCollection;

        stateFeatures.push({type: 'Feature', 
            properties: {name: e.stname, 
                         stfp: e.stfp, 
                         latlng: {lat: e.Y, lng: e.X} as LatLng, 
                         counties: countyData,
                         zoom: e.zoom} as State, 
            geometry: e.geometry as GeoJSON.Geometry})

    });

    const stateData = {type: 'FeatureCollection', features: stateFeatures} as GeoJSON.FeatureCollection;

    return stateData;
}
