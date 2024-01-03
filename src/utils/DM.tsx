// Data Management Step
import stateGeo from "../data/processed/stateGeoJSON.json";
import countyGeo from "../data/processed/countyGeoJSON.json";  
import tractGeo from "../data/processed/tractGeoJSON.json";
import countyAdj from "../data/processed/countyAdjacency.json";

import { State, County, Tract } from "./Types";
import { LatLng } from "leaflet";

import { Feature } from "geojson";

const stateData = {type: 'FeatureCollection', features: [] as GeoJSON.Feature[]} as GeoJSON.FeatureCollection;

export function formattedStateGeoJSON() {

    const stateFeatures = [] as GeoJSON.Feature[];

    stateGeo.forEach((e: any) => {

        const countyFeatures = [] as GeoJSON.Feature[];

        countyGeo.filter((d: any) => d.stfp === e.stfp).forEach((d: any) => {

            const tractFeatures = [] as GeoJSON.Feature[];

            tractGeo.filter((c: any) => c.cntyfp === d.cntyfp).forEach((c: any) => {

                tractFeatures.push({type: 'Feature', 
                    properties: {name: c.name,
                                 stfp: c.stfp, 
                                 cntyfp: c.cntyfp,
                                 tractfp: c.tractfp,
                                 geoid: c.geoid,
                                 latlng: {lat: c.Y, lng: c.X} as LatLng,
                                 zoom: 12} as Tract, 
                    geometry: c.geometry as GeoJSON.Geometry})

            });

            const tractData = {type: 'FeatureCollection', features: tractFeatures} as GeoJSON.FeatureCollection;

            countyFeatures.push({type: 'Feature', 
                properties: {name: d.name,
                             cntyfp: d.cntyfp,
                             geoid: d.geoid,
                             latlng: {lat: d.Y, lng: d.X} as LatLng,
                             tracts: tractData,
                             adjacencies: countyAdj.filter((a: any) => a.geoid === d.geoid).map((a: any) => a.neighborGeoid),
                             zoom: 10} as County, 
                geometry: d.geometry as GeoJSON.Geometry})
        });
        
        const countyData = {type: 'FeatureCollection', features: countyFeatures} as GeoJSON.FeatureCollection;

        stateFeatures.push({type: 'Feature', 
            properties: {name: e.name,
                         stfp: e.stfp,
                         latlng: {lat: e.Y, lng: e.X} as LatLng,
                         counties: countyData,
                         zoom: e.zoom} as State, 
            geometry: e.geometry as GeoJSON.Geometry})

    });

    stateData.features = stateFeatures;

    return stateData;
}

export function unnestedCounties() {

    const features: Feature[] = [];

    stateData.features.forEach((e: any) => {
        e.properties.counties.features.forEach((d: any) => {
            features.push(d);
        });
    });

    const countyDataAll = {type: 'FeatureCollection', 
                           features: features} as GeoJSON.FeatureCollection;

    return countyDataAll;

}
