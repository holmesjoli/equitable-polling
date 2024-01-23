import * as d3 from 'd3';

import { theme } from './Theme';

export const thresholdScale = d3.scaleThreshold([-1, 15, 30, 45], ['#C6C6C6', '#c0d2d9', '#95bac8', '#67a3b7', '#2a8ca7' ]);

export const pollStrokeScale = d3.scaleOrdinal()
  .domain(["increase", "nochange", "decrease"] )
  .range(["#610063", theme.grey.primary, "#E45729"] );

export const pollFillScale = d3.scaleOrdinal()
  .domain(['-3', '-2', '-1', '0', '1', '2', '3'] )
  .range(["#E45729", "#F28559", "#FBB18A", theme.grey.secondary, "#C498A6", "#935485", "#610063"] );

// Created using https://gka.github.io/palettes/#/6|s|2a8ca7,eaeaea|ffffe0,ff005e,93003a|1|1
export const geoFillScale = d3.scaleOrdinal()
  .domain(['3', '2', '1', '0'])
  .range(['#2a8ca7', '#67a3b7', '#95bac8', '#c0d2d9'])

export const rScale = d3.scaleSqrt()
  .domain([1, 30])
  .range([3, 15]);

export const sizeData =[{id: 0, rSize: 2, label: '0' },
                        {id: 1, rSize: 5, label: "Between 1 and 5" },
                        {id: 2, rSize: 15, label: "Between 15 and 30" },
                        {id: 3, rSize: 30, label: "Greater than 30" }];

export const equityIndicatorData = [{variable: 'pctBlack', label: 'Less than 15%', id: '0'},
                                {variable: 'pctBlack', label: 'Between 15% and 30%', id: '1'},
                                {variable: 'pctBlack', label: 'Between 30% and 45%', id: '2'},
                                {variable: 'pctBlack', label: 'Greater than 45%', id: '3'}];
