import { LatLng } from "leaflet";

export type Bounds = {northEast: LatLng, southWest: LatLng};

export type GeoID = {geoid: string, name: string, type: string, latlng: LatLng, zoom: number};

export type Tract = {type: string, stfp: string, cntyfp: string, tractfp: string, name: string, 
                    geoid: string, latlng: LatLng, zoom: number, bounds: Bounds, selected: boolean};

export type VotingDistrict = {type: string, stfp: string, cntyfp: string, vtdst: string, name: string, geoid: string, bounds: Bounds,
                              selected: boolean, latlng: LatLng};

export type County = {type: string, stfp: string, name: string, cntyfp: string, geoid: string,
                      latlng: LatLng, zoom: number, selected: boolean, bounds: Bounds};

export type State = {type: string, stfp: string, geoid: string, name: string, counties: GeoJSON.FeatureCollection, latlng: LatLng, zoom: number};

export type ChangeYear = {id: string, descr: string, baseYear: number};

export type EquityIndicator = {id: string, descr: string};

export type Indicator = {id: string, descr: string};
