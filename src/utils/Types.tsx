import { LatLng } from "leaflet";

export type County = {stfp: string, name: string, cntyfp: string, geoid: string, latlng: LatLng, zoom: number};

export type State = {stfp: string, name: string, counties: GeoJSON.FeatureCollection, latlng: LatLng, zoom: number};

export type ChangeYear = {id: string, descr: string, baseYear: number};

export type EquityIndicator = {id: string, descr: string};

export type Indicator = {id: string, descr: string};
