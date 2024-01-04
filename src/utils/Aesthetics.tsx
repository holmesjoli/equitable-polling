import * as d3 from 'd3';

export const layersStyle = {default: { color: '#757575', fillColor: "#FAF6F0", fillOpacity: 0.5, weight: 1, pointer: 'cursor' },
                            selected: { color: '#757575', fillColor: "#FAF6F0", fillOpacity: 0, weight: 2 },
                            highlight: { color: "#047391", fillColor: "#047391"},
                            greyOut: { color: '#EAEAEA', fillOpacity: 0.75, weight: 0 }
}

// Scales
export const strokeColorScale = d3.scaleOrdinal()
  .domain(["increase", "nochange", "decrease"] )
  .range(["#610063", "#757575", "#E45729"] );

export const fillColorScale = d3.scaleOrdinal()
  .domain(['-3', '-2', '-1', '0', '1', '2', '3'] )
  .range(["#E45729", "#F28559", "#FBB18A", "#C6C6C6", "#C498A6", "#935485", "#610063"] );

export const rScale = d3.scaleSqrt()
  .domain([1, 30])
  .range([3, 15]);

function getColor(d: any) {
    return d ? "#FAF6F0" : "#757575";
}

function getWeight(d: any) {
    return d ? 6 : 1;
}

export function highlightSelectedStyle(feature: any) {
    return {
        color: "#757575",
        fillColor: getColor(feature.properties!.selected),
        weight: getWeight(feature.properties!.selected),
        opacity: 1,
        fillOpacity: .15
    };
}