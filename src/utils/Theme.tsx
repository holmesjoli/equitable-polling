import * as d3 from 'd3';

export const theme = {
    fontSize: 13,
    grey: {primary: '#757575', secondary: '#C6C6C6', teriary: '#EAEAEA'},
    backgroundFill: '#FAF6F0',
    focusColor: '#047391',
    fontFamily: 'Inter'
}

export const layersStyle = {default: { color: theme.grey.primary, fillColor: theme.backgroundFill, fillOpacity: 0.5, weight: 1 },
                            defaultTract: { color: theme.grey.primary, fillColor: theme.backgroundFill, fillOpacity: 0, weight: 1 },
                            outline: { color: theme.grey.primary, fillColor: theme.backgroundFill, fillOpacity: 0, weight: 2 },
                            highlight: { color: theme.focusColor, fillColor: theme.focusColor},
                            highlightTract: { color: theme.focusColor, fillColor: theme.focusColor, fillOpacity: .5},
                            greyOut: { color: theme.grey.teriary, fillOpacity: 0.75, weight: 0},
                            vd: { color: theme.focusColor, fillOpacity: 0, weight: 1 }
                          }

// Scales
export const strokeColorScale = d3.scaleOrdinal()
  .domain(["increase", "nochange", "decrease"] )
  .range(["#610063", theme.grey.primary, "#E45729"] );

export const fillColorScale = d3.scaleOrdinal()
  .domain(['-3', '-2', '-1', '0', '1', '2', '3'] )
  .range(["#E45729", "#F28559", "#FBB18A", theme.grey.secondary, "#C498A6", "#935485", "#610063"] );

export const rScale = d3.scaleSqrt()
  .domain([1, 30])
  .range([3, 15]);

function getColor(d: any) {
    return d ? theme.backgroundFill : theme.grey.primary;
}

function getWeight(d: any) {
    return d ? 3 : 1;
}

function getOpacity(d: any) {
  return d ? 1 : .25;
}

export function highlightSelectedStyle(feature: any) {
    return {
      color: theme.grey.primary,
      fillColor: getColor(feature.properties!.selected),
      weight: getWeight(feature.properties!.selected),
      opacity: 1,
      fillOpacity: .15
    };
}

export function tractStyle(feature: any) {

  return {
    color: theme.grey.primary,
    fillColor: theme.backgroundFill,
    weight: 1,
    opacity: getOpacity(feature.properties!.selected),
    fillOpacity: 0
  };
}

export function vdStyle(feature: any) {
  return {
    color: theme.focusColor,
    weight: 1,
    opacity: getOpacity(feature.properties!.selected),
    fillOpacity: 0
  };
}
