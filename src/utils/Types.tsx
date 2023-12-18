export type County = {cntyname: string, cntyfp: string, cntygeoid: string};

export type State = {stname: string, stfp: string, counties: County[]};

export type ChangeYear = {id: string, changeYear: string, baseYear: number};
