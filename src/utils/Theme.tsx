export const theme = {
    fontSize: 13,
    grey: {primary: '#757575', secondary: '#C6C6C6', tertiary: '#EAEAEA'},
    backgroundFill: '#FAF6F0',
    focusColor: '#464646',
    focusColorDark : '#232323',
    darkGradientColor: "#113A55",
    fontFamily: 'Inter'
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
                            }
                          }

function getColor(d: any) {
    return d ? theme.backgroundFill : theme.grey.primary;
}

function getStrokeOpacity(d: any) {
  return d ? 1 : .25;
}

function getFillOpacity(d: any) {
  return d ? .5 : .25;
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

  } else if (feature.properties.type === "County") {
    return {
      color: feature.properties!.equityIndicator.strokeColor,
      fillColor: feature.properties!.equityIndicator.fillColor,
      weight: 1,
      opacity: 1,
      fillOpacity: .6
    };

  } else if(feature.properties.type === "Tract") {
    if (feature.properties.equityIndicator.variable === 'none') {
      return tractStyle(feature);
    } else {
      return {
        color: feature.properties!.equityIndicator.strokeColor,
        fillColor: feature.properties!.equityIndicator.fillColor,
        weight: 1,
        opacity: getStrokeOpacity(feature.properties!.selected),
        fillOpacity: getFillOpacity(feature.properties!.selected)
      };
    }
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
