import * as d3 from 'd3';

import { theme } from './Theme';

// Created using https://gka.github.io/palettes/#/6|s|2a8ca7,eaeaea|ffffe0,ff005e,93003a|1|1
export const thresholdScale = d3.scaleThreshold([-1, 15, 30, 45], ['#C6C6C6', '#a2c2d8', '#6999b8', '#437da3', '#1d6183']);

export const pollStrokeScale = d3.scaleOrdinal()
  .domain(["increase", "nochange", "decrease"] )
  .range(["#610063", theme.grey.primary, "#E45729"] );

export const pollFillScale = d3.scaleOrdinal()
  .domain(['-3', '-2', '-1', '0', '1', '2', '3'] )
  .range(["#E45729", "#F28559", "#FBB18A", theme.grey.secondary, "#C498A6", "#935485", "#610063"] );

export const rScale = d3.scaleSqrt()
  .domain([1, 30])
  .range([3, 15]);

export const sizeData =[{id: 0, rSize: 2, label: '0' },
                        {id: 1, rSize: 5, label: "Between 1 and 5" },
                        {id: 2, rSize: 15, label: "Between 15 and 30" },
                        {id: 3, rSize: 30, label: "Greater than 30" }];

export const equityIndicatorData = [{variable: 'pctBlack', label: 'Less than 15%', pctBlack: 10},
                                    {variable: 'pctBlack', label: 'Between 15% and 30%', pctBlack: 25},
                                    {variable: 'pctBlack', label: 'Between 30% and 45%', pctBlack: 40},
                                    {variable: 'pctBlack', label: 'Greater than 45%', pctBlack: 46}];
