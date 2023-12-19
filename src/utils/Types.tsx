import { LatLng } from "leaflet";

// export type Centroid = {lat: number, lng: number};

export type County = {cntyname: string, cntyfp: string, cntygeoid: string};

export type State = {stname: string, stfp: string, counties: County[], latlng: LatLng};

export type ChangeYear = {id: string, descr: string, baseYear: number};

export type EquityIndicator = {id: string, descr: string};
