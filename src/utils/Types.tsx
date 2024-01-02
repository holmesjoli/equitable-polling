import { LatLng } from "leaflet";

export type Tract = {stfp: string, cntyfp: string, tractfp: string, name: string, geoid: string, latlng: LatLng, zoom: number};

export type County = {stfp: string, name: string, cntyfp: string, geoid: string, tracts: GeoJSON.FeatureCollection, adjacencies: string[], latlng: LatLng, zoom: number};

export type State = {stfp: string, name: string, counties: GeoJSON.FeatureCollection, latlng: LatLng, zoom: number};

export type ChangeYear = {id: string, descr: string, baseYear: number};

export type EquityIndicator = {id: string, descr: string};

export type Indicator = {id: string, descr: string};
