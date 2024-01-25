import { LatLng } from "leaflet";

export type PixelCoords = {x: number, y: number};

export type Bounds = {northEast: LatLng, southWest: LatLng};

export type GeoID = {geoid: string, name: string, type: string, latlng: LatLng, zoom: number};

export type EquityIndicatorData = {variable: string, descr: string, equityMeasure: number, fillColor:string, strokeColor: string};

export type ChangeYearEquityIndicator = {changeYear: string, none:EquityIndicatorData, pctBlack: EquityIndicatorData};

export type Tract = {type: string, stfp: string, cntyfp: string, tractfp: string, name: string, 
                    geoid: string, latlng: LatLng, zoom: number, bounds: Bounds, selected: boolean,
                    // changeYearEquityIndicator: ChangeYearEquityIndicator[]
                  };

export type VotingDistrict = {type: string, stfp: string, cntyfp: string, vtdst: string, name: string, geoid: string, bounds: Bounds,
                              selected: boolean, latlng: LatLng};

export type County = {type: string, stfp: string, name: string, cntyfp: string, geoid: string,
                      latlng: LatLng, zoom: number, selected: boolean, bounds: Bounds, 
                      changeYearEquityIndicator: ChangeYearEquityIndicator[]
                    };

export type State = {type: string, stfp: string, geoid: string, name: string, counties: GeoJSON.FeatureCollection, 
                     latlng: LatLng, zoom: number};

export type ChangeYear = {id: string, descr: string, baseYear: number, changeYear: string};

export type EquityIndicator = {variable: string, descr: string};

export type Indicator = {id: string, descr: string};

export type Longitudinal = {geoid: string, stfp: string, cntyfp: string, pctBlack: number, baseYear: number};
export type PollingLoc = {type: string, name: string, descr: string, latlng: LatLng, 
                          pixelCoords?: PixelCoords, pollId: string, status: string | undefined, overall: string | undefined, id: string | undefined};

export type ChangeYearData = {changeYear: string, pollingLocsData: PollingLoc[]};
