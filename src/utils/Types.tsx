export type Centroid = {lat: number, long: number}

export type County = {cntyname: string, cntyfp: string, cntygeoid: string};

export type State = {stname: string, stfp: string, counties: County[], centroid: Centroid};

export type ChangeYear = {id: string, descr: string, baseYear: number};

export type EquityIndicator = {id: string, descr: string};
