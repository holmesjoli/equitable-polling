// Raw Data
import stateGeo from "../data/processed/stateGeoJSON.json";
import countyGeo from "../data/processed/countyGeoJSON.json";  
import tractGeo from "../data/processed/tractGeoJSON.json";
import vdGeo from "../data/processed/votingDistrictGeoJSON.json";
import countyLong from "../data/processed/countyLongitudinal.json"; 
import tractLong from "../data/processed/tractLongitudinal.json"; 
import pollsChangeStatus from "../data/processed/pollsChangeStatus.json";

// Scales
import { theme, thresholdScale } from "./Theme";

// Types
import { State, County, Tract, Bounds, VotingDistrict, PollingLoc, ChangeYearData, Longitudinal, ChangeYear, EquityIndicator } from "./Types";
import { LatLng } from "leaflet";
import { Feature } from "geojson";

import { selectVariable } from "./Global";

// Processed Data
export const countyLongitudinal = getLongitudinal(countyLong);
export const tractLongitudinal = getLongitudinal(tractLong);
export const stateData = getStates();
export const vdData = getVd();
export const changeYearDataAll = getChangeYearData();

// Returns the equity measure for the selected equity indicator
function findEquityMeasure(equityIndicator: EquityIndicator, long : Longitudinal[], d: any) {

    const equityMeasure = equityIndicator.variable === 'none' ? -1 : long.find((e: Longitudinal) => e.geoid === d.geoid)?.pctBlack as number | undefined;

    return {
        variable: equityIndicator.variable,
        descr: equityIndicator.descr,
        equityMeasure: equityMeasure,
        strokeColor: equityIndicator.variable === 'none' ? theme.grey.primary: theme.darkGradientColor,
        fillColor: equityIndicator.variable === 'none' ? theme.backgroundFill : thresholdScale(equityMeasure ?? -1) as string,
        baseYear: long[0].baseYear
    }
}

// Structures the bounds for each geometry
function getBounds(d: any) {
    return {northEast: {lat: d.ymax, lng: d.xmin} as LatLng,
            southWest: {lat: d.ymin, lng: d.xmax} as LatLng } as Bounds;
}

// Structures lat long object
function getLatLng(d: any) {
    return {lat: d.Y, lng: d.X} as LatLng;
}

// Refturns a feature collection 
function returnFeatureCollection(features: Feature[]) {
    return {type: 'FeatureCollection', features: features as GeoJSON.Feature[]} as GeoJSON.FeatureCollection;
}

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
                             latlng: getLatLng(d),
                             bounds: getBounds(d) 
                            }, 
                geometry: d.geometry as GeoJSON.Geometry})
        });

        const countyData = {type: 'FeatureCollection', features: countyFeatures} as GeoJSON.FeatureCollection;

        stateFeatures.push({type: 'Feature', 
            properties: {type: 'State',
                         descr: '',
                         name: e.name,
                         stfp: e.stfp,
                         geoid: e.geoid, 
                         latlng: getLatLng(e),
                         counties: countyData,
                         zoom: e.zoom} as State, 
            geometry: e.geometry as GeoJSON.Geometry})
    });


    return returnFeatureCollection(stateFeatures);
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
                         latlng: getLatLng(d),
                         zoom: 10,
                         selected: false,
                         equityIndicator: findEquityMeasure(equityIndicator, long, d),
                         bounds: getBounds(d)
                        } as County, 
            geometry: d.geometry as GeoJSON.Geometry})
    });

    return returnFeatureCollection(features);
}

// Returns a feature collection of all the tracts for the selected project states
export function getTracts(changeYear: ChangeYear, equityIndicator: EquityIndicator) {

    const long = tractLongitudinal.filter(d => d.baseYear === changeYear.baseYear);

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
                             latlng: getLatLng(d),
                             zoom: 12,
                             selected: false,
                             equityIndicator: findEquityMeasure(equityIndicator, long, d),
                             bounds: getBounds(d)
                            } as Tract, 
                geometry: d.geometry as GeoJSON.Geometry})
    });

    return returnFeatureCollection(features);
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
                         latlng: getLatLng(d),
                         bounds: getBounds(d)
                        } as VotingDistrict, 
            geometry: d.geometry as GeoJSON.Geometry})
    });

    return returnFeatureCollection(features);
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

// Get Polling Locations
export function getChangeYearData() {

    const changeStatus: ChangeYearData[] = [];

    selectVariable.changeYear.forEach((e) => {

        const pollingLoc: PollingLoc[] = [];

         (pollsChangeStatus as any[])
            .filter((d: any) => d.changeYear === e.changeYear)
            .forEach((d: any) => {

                pollingLoc.push({
                        type: 'Poll',
                        descr: 'Polling location',
                        name: d.name,
                        latlng: { lat: d.Y, lng: d.X } as LatLng,
                        pollId: d.pollId,
                        status: d.status,
                        overall: d.overall,
                        id: d.id
                    } as PollingLoc );
            });

        changeStatus.push({changeYear: e.changeYear, pollingLocsData: pollingLoc} as ChangeYearData);
    });

    return changeStatus;
}
