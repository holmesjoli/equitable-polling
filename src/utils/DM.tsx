// Raw Data
import stateGeo from "../data/processed/stateGeoJSON.json";
import countyGeo from "../data/processed/countyGeoJSON.json";  
import tractGeo from "../data/processed/tractGeoJSON.json";
import countyAdj from "../data/processed/countyAdjacency.json";

// Types
import { State, County, Tract } from "./Types";
import { LatLng } from "leaflet";
import { Feature } from "geojson";

// Processed Data
export const stateData = formattedStateGeoJSON();
export const countyData = unnestedCounties();

function formattedStateGeoJSON() {

    const stateFeatures = [] as GeoJSON.Feature[];

    (stateGeo as any[]).forEach((e: any) => {

        const countyFeatures = [] as GeoJSON.Feature[];

        (countyGeo as any[]).filter((d: any) => d.stfp === e.stfp).forEach((d: any) => {

            const tractFeatures = [] as GeoJSON.Feature[];

            (tractGeo as any[]).filter((c: any) => (c.cntyfp === d.cntyfp) && (c.stfp === d.stfp)).forEach((c: any) => {

                tractFeatures.push({type: 'Feature', 
                    properties: {type: 'Tract',
                                 descr: 'Census tract',
                                 name: c.name,
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
                properties: {type: 'County',
                             descr: 'County',
                             name: d.name,
                             cntyfp: d.cntyfp,
                             stfp: d.stfp,
                             geoid: d.geoid,
                             latlng: {lat: d.Y, lng: d.X} as LatLng,
                             tracts: tractData,
                             adjacencies: countyAdj.filter((a: any) => a.geoid === d.geoid).map((a: any) => a.neighborGeoid),
                             zoom: 10,
                             selected: false} as County, 
                geometry: d.geometry as GeoJSON.Geometry})
        });
        
        const countyData = {type: 'FeatureCollection', features: countyFeatures} as GeoJSON.FeatureCollection;

        stateFeatures.push({type: 'Feature', 
            properties: {type: 'State',
                         descr: '',
                         name: e.name,
                         stfp: e.stfp,
                         latlng: {lat: e.Y, lng: e.X} as LatLng,
                         counties: countyData,
                         zoom: e.zoom} as State, 
            geometry: e.geometry as GeoJSON.Geometry})
    });

    return {type: 'FeatureCollection', features: stateFeatures as GeoJSON.Feature[]} as GeoJSON.FeatureCollection;;
}

// Returns an unnested list of all the counties for the project
export function unnestedCounties() {

    const features: Feature[] = [];

    stateData.features.forEach((e: any) => {
        e.properties.counties.features.forEach((d: any) => {
            features.push(d);
        });
    });

    return {type: 'FeatureCollection', 
            features: features} as GeoJSON.FeatureCollection;
}

// Returns an unnested list of all the counties for the project
export function unnestedTracts(stfp: string) {

    const features: Feature[] = [];

    countyData.features
    .filter((d: any) => d.properties.stfp === stfp)
    .forEach((e: any) => {
        e.properties.tracts.features.forEach((d: any) => {
            features.push(d);
        });
    });

    return {type: 'FeatureCollection', 
            features: features} as GeoJSON.FeatureCollection;
}

// Returns the adjacent tracts to the selected county
// First returns the adjacent counties, then the tracts in those counties
export function getAdjacentTracts(selectedCounty: County) {

    const features: Feature[] = [];

    countyData.features
            .filter((d: any) => d.properties.adjacencies.includes(selectedCounty.geoid))
            .forEach((d: any) => {
                d.properties.tracts.features.forEach((e: any) => {
                    features.push(e);
                }); 
            });

    return {type: 'FeatureCollection', 
            features: features} as GeoJSON.FeatureCollection;
}

// Updates the selectedState data with the selected county
export function updateSelectedCounty(cntyfp: any) {

    if (cntyfp !== '') {
        countyData.features.forEach((d: GeoJSON.Feature) => {
            if (d.properties!.cntyfp === cntyfp) {
                d.properties!.selected = true;
            } else {
                d.properties!.selected = false;
            }
        });
    }
}
