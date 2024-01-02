// Data Management Step
import stateGeo from "../data/stateGeoJSON.json";
import countyGeo from "../data/countyGeoJSON.json";  
import tractGeo from "../data/tractGeoJSON.json";  

import { State, County, Tract } from "./Types";
import { LatLng } from "leaflet";

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

    const stateData = {type: 'FeatureCollection', features: stateFeatures} as GeoJSON.FeatureCollection;

    return stateData;
}
