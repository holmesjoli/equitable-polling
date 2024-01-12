// Raw Data
import stateGeo from "../data/processed/stateGeoJSON.json";
import countyGeo from "../data/processed/countyGeoJSON.json";  
import tractGeo from "../data/processed/tractGeoJSON.json";
import vdGeo from "../data/processed/votingDistrictGeoJSON.json";

// Types
import { State, County, Tract, Bounds, VotingDistrict } from "./Types";
import { LatLng } from "leaflet";
import { Feature } from "geojson";

// Processed Data
export const stateData = getStates();
export const countyData = getCounties();
export const vdData = getVd();

function getStates() {

    const stateFeatures = [] as GeoJSON.Feature[];

    (stateGeo as any[]).forEach((e: any) => {

        const countyFeatures = [] as GeoJSON.Feature[];

        (countyGeo as any[]).filter((d: any) => d.stfp === e.stfp).forEach((d: any) => {

            const vdFeatures = [] as GeoJSON.Feature[];

            (vdGeo as any[]).filter((c: any) => c.cntyfp === d.cntyfp).forEach((c: any) => {

                vdFeatures.push({type: 'Feature', 
                    properties: {type: 'Voting district',
                                 name: c.name,
                                 stfp: c.stfp, 
                                 cntyfp: c.cntyfp,
                                 geoid: c.geoid,
                                 vtdst: c.vtdst} as VotingDistrict, 
                    geometry: c.geometry as GeoJSON.Geometry})
            });

            const vdData = {type: 'FeatureCollection', features: vdFeatures} as GeoJSON.FeatureCollection;

            countyFeatures.push({type: 'Feature', 
                properties: {type: 'County',
                             descr: 'County',
                             name: d.name,
                             cntyfp: d.cntyfp,
                             stfp: d.stfp,
                             geoid: d.geoid,
                             latlng: {lat: d.Y, lng: d.X} as LatLng,
                             vtdsts: vdData,
                             zoom: 10,
                             selected: false,
                             bounds: {northEast: {lat: d.ymax, lng: d.xmin} as LatLng,
                                      southWest: {lat: d.ymin, lng: d.xmax} as LatLng } as Bounds} as County, 
                geometry: d.geometry as GeoJSON.Geometry})
        });

        const countyData = {type: 'FeatureCollection', features: countyFeatures} as GeoJSON.FeatureCollection;

        stateFeatures.push({type: 'Feature', 
            properties: {type: 'State',
                         descr: '',
                         name: e.name,
                         stfp: e.stfp,
                         geoid: e.geoid, 
                         latlng: {lat: e.Y, lng: e.X} as LatLng,
                         counties: countyData,
                         zoom: e.zoom} as State, 
            geometry: e.geometry as GeoJSON.Geometry})
    });

    return {type: 'FeatureCollection', features: stateFeatures as GeoJSON.Feature[]} as GeoJSON.FeatureCollection;;
}

// Returns a feature collection of all the counties for the selected project states
export function getCounties() {

    const features: Feature[] = [];

    stateData.features.forEach((e: any) => {
        e.properties.counties.features.forEach((d: any) => {
            features.push(d);
        });
    });

    return {type: 'FeatureCollection', 
            features: features} as GeoJSON.FeatureCollection;
}

// Returns a feature collection of all the tracts for the selected project states
export function getTracts(stfp: string) {

    const features: Feature[] = [];

    (tractGeo as any[])
        .filter((c: any) => c.stfp === stfp)
        .forEach((c: any) => {
            features.push({type: 'Feature', 
                properties: {type: 'Tract',
                            descr: 'Census tract',
                            name: c.name,
                            stfp: c.stfp, 
                            cntyfp: c.cntyfp,
                            tractfp: c.tractfp,
                            geoid: c.geoid,
                            latlng: {lat: c.Y, lng: c.X} as LatLng,
                            zoom: 12,
                            bounds: {northEast: {lat: c.ymax, lng: c.xmin} as LatLng,
                                    southWest: {lat: c.ymin, lng: c.xmax} as LatLng } as Bounds} as Tract, 
                geometry: c.geometry as GeoJSON.Geometry})
    });

    return {type: 'FeatureCollection', 
            features: features} as GeoJSON.FeatureCollection;
}

export function getVd() {

    const features: Feature[] = [];

    (vdGeo as any[]).forEach((c: any) => {

        features.push({type: 'Feature', 
            properties: {type: 'Voting district',
                         name: c.name,
                         stfp: c.stfp, 
                         cntyfp: c.cntyfp,
                         geoid: c.geoid,
                         vtdst: c.vtdst} as VotingDistrict, 
            geometry: c.geometry as GeoJSON.Geometry})
    });

    return {type: 'FeatureCollection', 
            features: features} as GeoJSON.FeatureCollection;
}
