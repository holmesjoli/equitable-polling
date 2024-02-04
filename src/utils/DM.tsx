// Raw Data
import statesGeo from "../data/processed/statesGeoJSON.json";
import countiesGeo from "../data/processed/countiesGeoJSON.json";  

// Scales
import { theme, thresholdScale } from "./Theme";

// Types
import { State, County, Tract, Bounds, VotingDistrict, PollingLoc, ChangeYear } from "./Types";
import { LatLng } from "leaflet";
import { Feature } from "geojson";

// Processed Data
export const stateData = getStates();

// Returns the equity measure for the selected equity indicator
function findEquityMeasureByChangeYear(geoid: any,geoData: any, pollSummaryData: any[] | undefined = undefined) {

    const em = geoData.find((f: any) => f.geoid === geoid);

    // Added this logic because some tracts dont exist in all baseyear because of the census tract boundary changes
    let pctBlack;
    let pollSummary = undefined;
    if (em === undefined) {
        pctBlack =  {equityMeasure: 0,
                        strokeColor: theme.grey.primary,
                        fillColor: theme.grey.tertiary}
    } else {
        pctBlack =  {equityMeasure: em!.pctBlack, 
                        strokeColor: theme.darkGradientColor, 
                        fillColor: thresholdScale(em.pctBlack) as string}
    }

    if (pollSummaryData != undefined) {
        const indicatorYearData = pollSummaryData.find((f: any) => f.geoid === geoid);

        if (indicatorYearData !== undefined) { // todo removed if once we have complete data

            pollSummary = {changeNoPolls: indicatorYearData.changeNoPolls, 
                        overall: indicatorYearData.overall, 
                        overallChange: indicatorYearData.overallChange, 
                        id: indicatorYearData.id, 
                        rSize: indicatorYearData.rSize}
        }
    }

    return {none: {equityMeasure: 0,
                    strokeColor: theme.grey.primary,
                    fillColor: theme.backgroundFill},
            pctBlack: pctBlack,
            pollSummary: pollSummary
        };
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
                         abbr: e.abbr,
                         selected: false} as State, 
            geometry: e.geometry as GeoJSON.Geometry})
    });

    return returnFeatureCollection(stateFeatures);
}

// Returns a feature collection of all the counties for the selected project states
export function getCounties(countiesGeo: any[], countiesLong: any[], pollSummaryData: any[]) {

    const features: Feature[] = [];

    (countiesGeo as any[]).forEach((d: any) => {

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
                         changeYearData: findEquityMeasureByChangeYear(d.geoid, countiesLong, pollSummaryData),
                         bounds: getBounds(d)
                        } as County, 
            geometry: d.geometry as GeoJSON.Geometry})
    });

    return returnFeatureCollection(features);
}

// Returns a feature collection of all the tracts for the selected project states
export function getTracts(data: any[], tractsLong: any[], decennialCensusYear: number) {

    const features: Feature[] = [];

    (data as any[])
        .filter((d: any) => d.year === decennialCensusYear)
        .forEach((d: any) => {

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
                    changeYearData: findEquityMeasureByChangeYear(d.geoid, tractsLong),
                    bounds: getBounds(d),
                } as unknown as Tract,
                geometry: d.geometry as GeoJSON.Geometry})
        });

    return {type: 'FeatureCollection', features: features as GeoJSON.Feature[]} as GeoJSON.FeatureCollection;
}

export function getVd(data: any[]) {

    const features: Feature[] = [];

    (data as any[]).forEach((d: any) => {

        features.push({type: 'Feature', 
            properties: {type: 'Voting district',
                         descr: 'Voting district',
                         name: d.name,
                         stfp: d.stfp, 
                         cntyfp: d.cntyfp,
                         geoid: d.geoid,
                         vtdst: d.vtdst,
                         selected: true,
                         latlng: getLatLng(d),
                         bounds: getBounds(d)
                        } as VotingDistrict, 
            geometry: d.geometry as GeoJSON.Geometry})
    });

    return returnFeatureCollection(features);
}

// Get Polling Locations
export function getPollingLocsData(data: any[], changeYear: ChangeYear) {

    const pollingLoc: PollingLoc[] = [];

        (data as any[])
        .filter((d: any) => d.changeYear === changeYear.changeYear)
        .forEach((d: any) => {

            pollingLoc.push({
                    type: 'Poll',
                    descr: 'Polling location',
                    name: d.name,
                    latlng: { lat: d.Y, lng: d.X } as LatLng,
                    status: d.status,
                    overall: d.overall,
                    id: d.id
                } as PollingLoc );
        });

    return pollingLoc;
}
