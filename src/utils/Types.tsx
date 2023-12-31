import { LatLng } from "leaflet";

export type GeoID = {geoid: string, name: string, type: string, latlng: LatLng, zoom: number};

export type Tract = {type: string, stfp: string, cntyfp: string, tractfp: string, name: string, geoid: string, latlng: LatLng, zoom: number};

export type County = {type: string, stfp: string, name: string, cntyfp: string, geoid: string, tracts: GeoJSON.FeatureCollection, 
                      adjacencies: string[], latlng: LatLng, zoom: number, selected: boolean};

export type State = {type: string, stfp: string, name: string, counties: GeoJSON.FeatureCollection, latlng: LatLng, zoom: number};

export type ChangeYear = {id: string, descr: string, baseYear: number};

export type EquityIndicator = {id: string, descr: string};

export type Indicator = {id: string, descr: string};
