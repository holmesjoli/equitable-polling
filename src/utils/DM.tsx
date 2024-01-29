// Raw Data
import statesGeo from "../data/processed/statesGeoJSON.json";
import countiesGeo from "../data/processed/countiesGeoJSON.json";  
import tractsGeo from "../data/processed/tractsGeoJSON.json";
import vdsGeo from "../data/processed/votingDistrictsGeoJSON.json";
import countiesLong from "../data/processed/countiesLongitudinal.json"; 
import tractsLong from "../data/processed/tractsLongitudinal.json"; 
import pollsChangeStatus from "../data/processed/pollsChangeStatus.json";

// Scales
import { theme, thresholdScale } from "./Theme";

// Types
import { State, County, Tract, Bounds, VotingDistrict, PollingLoc, ChangeYearData, ChangeYearEquityIndicator } from "./Types";
import { LatLng } from "leaflet";
import { Feature } from "geojson";

import { selectVariable } from "./Global";

// Processed Data
export const stateData = getStates();
export const vdData = getVd();
export const changeYearDataAll = getChangeYearData();
export const tractsDataAll = getTracts();
export const countiesData = getCounties();

// Returns the equity measure for the selected equity indicator
function findEquityMeasureByChangeYear(geoData: any, d: any) {

    const changeYearData: ChangeYearEquityIndicator[] = [];

        selectVariable.changeYear.forEach((e) => {

            const em = geoData.find((f: any) => (f.baseYear === e.baseYear) && (f.geoid === d.geoid));

            // Added this logic because some tracts dont exist in all baseyear because of the census tract boundary changes
            let pctBlack;
            if (em === undefined) {
                pctBlack =  {equityMeasure: 0,
                             strokeColor: theme.grey.primary,
                             fillColor: theme.grey.tertiary}
            } else {
                pctBlack =  {equityMeasure: em!.pctBlack, 
                             strokeColor: theme.darkGradientColor, 
                             fillColor: thresholdScale(em.pctBlack) as string}
            }

            changeYearData.push({changeYear: e.changeYear, 
                                 none: {equityMeasure: 0,
                                        strokeColor: theme.grey.primary,
                                        fillColor: theme.backgroundFill},
                                 pctBlack: pctBlack
                                 });
        });

    return changeYearData;
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

    (statesGeo as any[]).forEach((e: any) => {

        const countyFeatures = [] as GeoJSON.Feature[];

        (countiesGeo as any[]).filter((d: any) => d.stfp === e.stfp).forEach((d: any) => {

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
                         zoom: e.zoom,
                         abbr: e.abbr} as State, 
            geometry: e.geometry as GeoJSON.Geometry})
    });

    return returnFeatureCollection(stateFeatures);
}

// Returns a feature collection of all the counties for the selected project states
export function getCounties() {

    const features: Feature[] = [];

    (countiesGeo as any[]).forEach((d: any) => {

        const changeYearData = findEquityMeasureByChangeYear(countiesLong, d);

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
                         changeYearEquityIndicator: changeYearData,
                         bounds: getBounds(d)
                        } as County, 
            geometry: d.geometry as GeoJSON.Geometry})
    });

    return returnFeatureCollection(features);
}

// Returns a feature collection of all the tracts for the selected project states
export function getTracts() {

    const censusYear: any[] = [];

    [2010, 2020].forEach((year: number) => {

        const features: Feature[] = [];

        (tractsGeo as any[])
            .filter((d: any) => d.year === year)
            .forEach((d: any) => {

                const changeYearData = findEquityMeasureByChangeYear(tractsLong, d);

                features.push({type: 'Feature', 
                    properties: {
                        type: 'Tract',
                        descr: 'Census tract',
                        name: d.name,
                        stfp: d.stfp,
                        cntyfp: d.cntyfp,
                        tractfp: d.tractfp,
                        geoid: d.geoid,
                        latlng: getLatLng(d),
                        zoom: 12,
                        selected: false,
                        changeYearEquityIndicator: changeYearData,
                        bounds: getBounds(d),
                    } as unknown as Tract,
                    geometry: d.geometry as GeoJSON.Geometry})
            });

        let tractsData = {type: 'FeatureCollection', features: features as GeoJSON.Feature[]} as GeoJSON.FeatureCollection;

        censusYear.push({decennialCensusYear: year, tractsData: tractsData});
    });

    return censusYear;
}

export function getVd() {

    const features: Feature[] = [];

    (vdsGeo as any[]).forEach((d: any) => {

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
