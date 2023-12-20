import { LatLng } from "leaflet";

// export type Centroid = {lat: number, lng: number};

export type County = {stfp: string, cntyname: string, cntyfp: string, cntygeoid: string, latlng: LatLng};

export type State = {stname: string, stfp: string, counties: GeoJSON.FeatureCollection, latlng: LatLng, zoom: number};

export type ChangeYear = {id: string, descr: string, baseYear: number};

export type EquityIndicator = {id: string, descr: string};

export type Indicator = {id: string, descr: string};
