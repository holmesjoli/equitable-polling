// Scales
import { theme, thresholdScale } from "./Theme";

// Types
import { State, County, Tract, Bounds, VotingDistrict, PollingLoc, ChangeYear } from "./Types";
import { LatLng } from "leaflet";
import { Feature } from "geojson";

// Returns the equity measure for the selected equity indicator
function findEquityMeasureByChangeYear(geoid: any, geoData: any) {

    const em = geoData.find((f: any) => f.geoid === geoid);

    let pctBlack;
    let pollSummary;
    if (em !== undefined) {
        pctBlack =  {equityMeasure: em!.pctBlack, 
                        strokeColor: theme.darkGradientColor, 
                        fillColor: thresholdScale(em.pctBlack) as string}
        pollSummary = {changeNoPolls: em.changeNoPolls, 
            overallChange: em.overallChange, 
            statusNumeric: em.statusNumeric}

        return { none: {equityMeasure: 0, //todo refactor to remove none
                strokeColor: theme.grey.primary,
                fillColor: theme.backgroundFill},
                pctBlack: pctBlack,
                pollSummary: pollSummary
        };
    } else {
        return undefined;
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

export function getStates(data: any) {

    const stateFeatures = [] as GeoJSON.Feature[];

    (data as any[]).forEach((d: any) => {

        stateFeatures.push({type: 'Feature', 
            properties: {type: 'State',
                         descr: '',
                         name: d.name,
                         stfp: d.stfp,
                         geoid: d.geoid, 
                         latlng: getLatLng(d),
                         zoom: d.zoom,
                         stabbr: d.stabbr,
                         bounds: getBounds(d),
                         selected: true} as State, 
            geometry: d.geometry as GeoJSON.Geometry})
    });

    return returnFeatureCollection(stateFeatures);
}

// Returns a feature collection of all the counties for the selected project states
export function getCounties(countiesGeo: any[], countiesLong: any[]) {

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
                         changeYearData: findEquityMeasureByChangeYear(d.geoid, countiesLong),
                         bounds: getBounds(d),
                         stabbr: d.stabbr
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
                         selected: false,
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
                    cntyfp: d.cntyfp,
                    status: d.status,
                    statusNumeric: d.statusNumeric
                } as PollingLoc );
        });

    return pollingLoc;
}
