import * as d3 from 'd3';

export const theme = {
    fontSize: 13,
    grey: {primary: '#757575', secondary: '#C6C6C6', tertiary: '#EAEAEA'},
    backgroundFill: '#FAF6F0',
    focusColor: '#320E3B',
    focusColorDark : '#72417F',
    darkGradientColor: "#113A55",
    fontFamily: 'Inter'
}

export const layersStyle = {default: { color: theme.grey.primary, fillColor: theme.backgroundFill, fillOpacity: 0.5, weight: 1 },
                            defaultTract: { color: theme.grey.primary, fillColor: theme.backgroundFill, fillOpacity: 0, weight: 1 },
                            outline: { color: theme.grey.primary, fillColor: theme.backgroundFill, fillOpacity: 0, weight: 2 },
                            highlight: { color: theme.focusColor, fillColor: theme.focusColor, weight: 2, fillOpacity: 0.65},
                            highlightTract: { color: theme.focusColor, fillColor: theme.focusColor, fillOpacity: .6},
                            greyOut: { color: theme.grey.tertiary, fillOpacity: 0.75, weight: 0},
                            vd: { color: theme.focusColor, fillOpacity: 0, weight: 1 }
                          }

function getColor(d: any) {
    return d ? theme.backgroundFill : theme.grey.primary;
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

export function choroplethStyle(feature: any) {

  if (feature.properties.type === "State") {
    return {
      color: theme.grey.primary,
      fillColor: theme.backgroundFill,
      weight: 1,
      opacity: 1,
      fillOpacity: .6
    };

  } else if (feature.properties.type === "County" || feature.properties.type === "Tract") {
    return {
      color: feature.properties!.equityIndicator.strokeColor,
      fillColor: feature.properties!.equityIndicator.fillColor,
      weight: 1,
      opacity: 1,
      fillOpacity: .6
    };
  }
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
