import * as d3 from 'd3';

export const theme = {
    fontSize: 13,
    grey: {primary: '#757575', secondary: '#C6C6C6', tertiary: '#EAEAEA'},
    backgroundFill: '#FAF6F0',
    focusColor: '#047391',
    focusColorDark : '#035C74',
    fontFamily: 'Inter'
}

export const layersStyle = {default: { color: theme.grey.primary, fillColor: theme.backgroundFill, fillOpacity: 0.5, weight: 1 },
                            defaultTract: { color: theme.grey.primary, fillColor: theme.backgroundFill, fillOpacity: 0, weight: 1 },
                            outline: { color: theme.grey.primary, fillColor: theme.backgroundFill, fillOpacity: 0, weight: 2 },
                            highlight: { color: theme.focusColor, fillColor: theme.focusColor},
                            highlightTract: { color: theme.focusColor, fillColor: theme.focusColor, fillOpacity: .5},
                            greyOut: { color: theme.grey.tertiary, fillOpacity: 0.75, weight: 0},
                            vd: { color: theme.focusColor, fillOpacity: 0, weight: 1 }
                          }

// Scales
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

function getColor(d: any) {
    return d ? theme.backgroundFill : theme.grey.primary;
}

function getWeight(d: any) {
    return d ? 3 : 1;
}

function getStrokeOpacity(d: any) {
  return d ? 1 : .25;
}

function getFillOpacity(d: any) {
  return d ? .3 : .1;
}

export function highlightSelectedCounty(feature: any) {
    return {
      color: theme.grey.primary,
      fillColor: getColor(feature.properties!.selected),
      weight: 3,
      opacity: getStrokeOpacity(feature.properties!.selected),
      fillOpacity: getFillOpacity(feature.properties!.selected)
    };
}

export function tractStyle(feature: any) {

  return {
    color: theme.grey.primary,
    fillColor: theme.backgroundFill,
    weight: 1,
    opacity: getStrokeOpacity(feature.properties!.selected),
    fillOpacity: 0
  };
}

export function vdStyle(feature: any) {
  return {
    color: theme.focusColorDark,
    weight: 1,
    opacity: getStrokeOpacity(feature.properties!.selected),
    fillOpacity: 0
  };
}
