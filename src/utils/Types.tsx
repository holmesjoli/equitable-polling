import { LatLng } from "leaflet";

export type County = {stfp: string, cntyname: string, cntyfp: string, cntygeoid: string, latlng: LatLng};

export type State = {stname: string, stfp: string, counties: GeoJSON.FeatureCollection, latlng: LatLng, zoom: number, selected: boolean};

export type ChangeYear = {id: string, descr: string, baseYear: number};

export type EquityIndicator = {id: string, descr: string};

export type Indicator = {id: string, descr: string};
