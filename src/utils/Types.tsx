import { LatLng } from "leaflet";

export type PixelCoords = {x: number, y: number};

export type Bounds = {northEast: LatLng, southWest: LatLng};

export type GeoID = {geoid: string, type: string };

export type EquityIndicatorData = {equityMeasure: number, fillColor:string, strokeColor: string};

export type PollSummary = {changeNoPolls: number, overall: string, overallChange: number, id: string, rSize: number};

export type ChangeYearData = {changeYear: string, none:EquityIndicatorData, pctBlack: EquityIndicatorData, pollSummary?: PollSummary};

export type Tract = {type: string, stfp: string, cntyfp: string, tractfp: string, name: string, 
                     geoid: string, latlng: LatLng, zoom: number, bounds: Bounds, selected: boolean,
                     changeYearData: ChangeYearData, year: number
                    };

export type VotingDistrict = {type: string, stfp: string, cntyfp: string, vtdst: string, name: string, geoid: string, bounds: Bounds,
                              selected: boolean, latlng: LatLng};

export type County = {type: string, stfp: string, name: string, cntyfp: string, geoid: string,
                      latlng: LatLng, zoom: number, selected: boolean, bounds: Bounds, 
                      changeYearData: any
                    };

export type State = {type: string, stfp: string, geoid: string, name: string, latlng: LatLng, zoom: number, abbr: string, selected: boolean};

export type ChangeYear = {id: string, descr: string, baseYear: number, changeYear: string, decennialCensusYear: number, ms: boolean, sc: boolean, ga: boolean, wi: boolean};

export type EquityIndicator = {variable: string, descr: string};

export type Indicator = {id: string, descr: string};

export type PollingLoc = {type: string, name: string, descr: string, latlng: LatLng, 
                          pixelCoords?: PixelCoords,
                          status: string | undefined, overall: string | undefined, id: string | undefined};
