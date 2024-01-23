// Raw Data
import stateGeo from "../data/processed/stateGeoJSON.json";
import countyGeo from "../data/processed/countyGeoJSON.json";  
import tractGeo from "../data/processed/tractGeoJSON.json";
import vdGeo from "../data/processed/votingDistrictGeoJSON.json";
import countyLong from "../data/processed/countyLongitudinal.json"; 
import tractLong from "../data/processed/tractLongitudinal.json"; 

// Types
import { State, County, Tract, Bounds, VotingDistrict, Longitudinal, ChangeYear, EquityIndicator } from "./Types";
import { LatLng } from "leaflet";
import { Feature } from "geojson";

// Processed Data
export const countyLongitudinal = getLongitudinal(countyLong);
export const tractLongitudinal = getLongitudinal(tractLong);
export const stateData = getStates();
export const tractData = getTracts();
export const vdData = getVd();

function getStates() {

    const stateFeatures = [] as GeoJSON.Feature[];

    (stateGeo as any[]).forEach((e: any) => {

        const countyFeatures = [] as GeoJSON.Feature[];

        (countyGeo as any[]).filter((d: any) => d.stfp === e.stfp).forEach((d: any) => {

            countyFeatures.push({type: 'Feature', 
                properties: {type: 'County',
                             descr: 'County',
                             name: d.name,
                             cntyfp: d.cntyfp,
                             stfp: d.stfp,
                             geoid: d.geoid,
                             latlng: {lat: d.Y, lng: d.X} as LatLng,
                             zoom: 10,
                             selected: false,
                             bounds: {northEast: {lat: d.ymax, lng: d.xmin} as LatLng,
                                      southWest: {lat: d.ymin, lng: d.xmax} as LatLng } as Bounds}, 
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
export function getCounties(changeYear: ChangeYear, equityIndicator: EquityIndicator) {

    const long = countyLongitudinal.filter(d => d.baseYear === changeYear.baseYear);

    const features: Feature[] = [];

    (countyGeo as any[]).forEach((d: any) => {

        features.push({type: 'Feature', 
            properties: {type: 'County',
                         descr: 'County',
                         name: d.name,
                         cntyfp: d.cntyfp,
                         stfp: d.stfp,
                         geoid: d.geoid,
                         latlng: {lat: d.Y, lng: d.X} as LatLng,
                         zoom: 10,
                         selected: false,
                         equityMeasure: equityIndicator.variable === 'none' ? -1: long.find((e: Longitudinal) => e.geoid === d.geoid)?.pctBlack,
                         bounds: {northEast: {lat: d.ymax, lng: d.xmin} as LatLng,
                                  southWest: {lat: d.ymin, lng: d.xmax} as LatLng } as Bounds} as County, 
            geometry: d.geometry as GeoJSON.Geometry})
    });

    return {type: 'FeatureCollection', 
            features: features} as GeoJSON.FeatureCollection;
}

// Returns a feature collection of all the tracts for the selected project states
export function getTracts() {

    const features: Feature[] = [];

    (tractGeo as any[])
        .forEach((d: any) => {
            features.push({type: 'Feature', 
                properties: {type: 'Tract',
                            descr: 'Census tract',
                            name: d.name,
                            stfp: d.stfp, 
                            cntyfp: d.cntyfp,
                            tractfp: d.tractfp,
                            geoid: d.geoid,
                            latlng: {lat: d.Y, lng: d.X} as LatLng,
                            zoom: 12,
                            selected: false,
                            bounds: {northEast: {lat: d.ymax, lng: d.xmin} as LatLng,
                                    southWest: {lat: d.ymin, lng: d.xmax} as LatLng } as Bounds} as Tract, 
                geometry: d.geometry as GeoJSON.Geometry})
    });

    return {type: 'FeatureCollection', 
            features: features} as GeoJSON.FeatureCollection;
}

export function getVd() {

    const features: Feature[] = [];

    (vdGeo as any[]).forEach((d: any) => {

        features.push({type: 'Feature', 
            properties: {type: 'Voting district',
                         descr: 'Voting district',
                         name: d.name,
                         stfp: d.stfp, 
                         cntyfp: d.cntyfp,
                         geoid: d.geoid,
                         vtdst: d.vtdst,
                         selected: false,
                         latlng: {lat: d.Y, lng: d.X} as LatLng,
                         bounds: {northEast: {lat: d.ymax, lng: d.xmin} as LatLng,
                                  southWest: {lat: d.ymin, lng: d.xmax} as LatLng } as Bounds} as VotingDistrict, 
            geometry: d.geometry as GeoJSON.Geometry})
    });

    return {type: 'FeatureCollection', 
            features: features} as GeoJSON.FeatureCollection;
}

function getLongitudinal(dataJson: any[]) {

    const data: Longitudinal[] = [];

    (dataJson as any[]).forEach((d: any) => {
        data.push({geoid: d.geoid,
                   stfp: d.stfp,
                   cntyfp: d.cntyfp,
                   baseYear: d.baseYear,
                   pctBlack: d.pctBlack} as Longitudinal)
    });

    return data;
}