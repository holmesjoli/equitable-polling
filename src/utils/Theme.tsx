import * as d3 from 'd3';

import { EquityIndicator } from "./Types";

export const theme = {
    fontSize: 12,
    grey: {primary: '#757575', secondary: '#C6C6C6', tertiary: '#EAEAEA'},
    backgroundFill: '#FAF6F0',
    focusColor: '#1D618E',
    focusColorDark: '#113A55',
    darkGradientColor: "#113A55",
    fontFamily: 'Inter',
    highlightOpacity: .8,
    nonHighlightOpacity: .3,
    lineHeight: 1.2
}

export const layersStyle = {default: { color: theme.grey.primary, fillColor: theme.backgroundFill, fillOpacity: 0.5, weight: 1 },
                            outline: { color: theme.grey.primary, fillColor: theme.backgroundFill, fillOpacity: 0, weight: 2 },
                            greyOut: { color: theme.grey.secondary, fillOpacity: 0.7, weight: 0},
                            State: {
                              highlight: { weight: 2 },
                            },
                            County: {
                              highlight: { weight: 3 },
                            },
                            Tract: {
                              highlight: { weight: 3 },
                            },
                            VD: {
                              highlight: { weight: 3 }
                            }
                          }

function getColor(d: any) {
    return d ? theme.backgroundFill : theme.grey.primary;
}

function getStrokeOpacity(d: any) {
  return d ? 1 : theme.nonHighlightOpacity;
}

function getFillOpacity(d: any) {
  return d ? theme.highlightOpacity : theme.nonHighlightOpacity;
}

// Selected county styles
export function highlightSelectedCounty(feature: any) {
    return {
      color: theme.grey.primary,
      fillColor: getColor(feature.properties!.selected),
      weight: 3,
      opacity: getStrokeOpacity(feature.properties!.selected),
      fillOpacity: getFillOpacity(feature.properties!.selected)
    };
}

export function choroplethStyle(feature: any, equityIndicator: EquityIndicator) {

  if (feature.properties.type === "State") {
    return stateStyle();
  } else if (feature.properties.type === "County") {
    return countyStyle(feature, equityIndicator);
  } else if (feature.properties.type === "Tract") {
    return tractStyle(feature, equityIndicator);
  } else {
    return vdStyle(feature);
  }
}

export function stateStyle() {
  return {
    color: theme.grey.primary,
    fillColor: theme.backgroundFill,
    weight: 1,
    opacity: 1,
    fillOpacity: .6
  };
}

export function returnSpecificEquityIndicator(feature: any, equityIndicator: EquityIndicator) {
  return feature.properties!.changeYearData[equityIndicator.variable];
}

export function countyStyle(feature: any, equityIndicator: EquityIndicator) {
  return {
    color: returnSpecificEquityIndicator(feature, equityIndicator).strokeColor,
    fillColor: returnSpecificEquityIndicator(feature, equityIndicator).fillColor,
    weight: 1,
    opacity: 1,
    fillOpacity: theme.highlightOpacity
  };
}


export function tractStyle(feature: any, equityIndicator: EquityIndicator) {
  return {
    color: returnSpecificEquityIndicator(feature, equityIndicator).strokeColor,
    fillColor: returnSpecificEquityIndicator(feature, equityIndicator).fillColor,
    weight: 1,
    opacity: getStrokeOpacity(feature.properties!.selected),
    fillOpacity: equityIndicator.variable === "none" ? 0 : feature.properties!.selected? theme.highlightOpacity : theme.nonHighlightOpacity
  };
}

// Voting district styles
export function vdStyle(feature: any) {
  return {
    color: theme.focusColorDark,
    weight: 1,
    opacity: getStrokeOpacity(feature.properties!.selected),
    fillOpacity: 0
  };
}

// Poll styles
export function pollStyle(point: any) {
  return {
    fillColor: pollFillScale(point.id) as string,
    color: pollStrokeScale(point.overall) as string,
    weight: 1,
    opacity: 1,
    fillOpacity: 1
  };
}

export function pollSummarySize(point: any) {
  const r = rScale(point.rSize);
  return r*500;
}

// https://coolors.co/f5ece0-320e3b-1d618e-e45729-610063
export const thresholdScale = d3.scaleThreshold([-1, 15, 30, 45], ['#C6C6C6', '#a2c2d8', '#6999b8', '#437da3', '#1d6183']);

export const pollStrokeScale = d3.scaleOrdinal()
  .domain(["added", "nochange", "removed"] )
  .range(["#610063", theme.grey.primary, "#E45729"] );

export const pollFillScale = d3.scaleOrdinal()
  .domain(['-3', '-2', '-1', '0', '1', '2', '3'] )
  .range(["#E45729", "#F28559", "#FBB18A", theme.grey.secondary, "#C498A6", "#935485", "#610063"] );

export const rScale = d3.scaleSqrt()
  .domain([1, 30])
  .range([3, 15]);

export const sizeData =[{id: 0, rSize: 1, label: '0' },
                        {id: 1, rSize: 2, label: "Between 1 and 5" },
                        {id: 3, rSize: 5, label: "Between 6 and 15" },
                        {id: 4, rSize: 15, label: "Between 16 and 30" },
                        {id: 5, rSize: 30, label: "Greater than 30" }];

export const equityIndicatorData = [{variable: 'pctBlack', label: 'Less than 15%', pctBlack: 10},
                                    {variable: 'pctBlack', label: 'Between 15% and 30%', pctBlack: 25},
                                    {variable: 'pctBlack', label: 'Between 30% and 45%', pctBlack: 40},
                                    {variable: 'pctBlack', label: 'Greater than 45%', pctBlack: 46}];
