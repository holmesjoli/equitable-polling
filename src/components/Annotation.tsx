import React, { useEffect } from 'react';
import * as d3 from 'd3';

// Styles
import { layersStyle, theme } from "../utils/Theme";

const selector = "root";

// Reusable function to initialize svg
export function init() {
    d3.select(`#${selector}`)
      .append('div')
      .attr('class', 'Annotation')
      .attr('width', '100px')
      .attr('height', '50px')
      .style('position', 'absolute')
      .style('top', '0px')
      .style('left', '0px')
      .style('visibility', 'hidden')
}

export function updateAnnotation() {

    const data = [{x: 500, y: 200, text: "Test", id: 1}]

    d3.select(`#${selector} .Annotation`)
    .style('visibility', 'visible')
    .style('top', `${data[0].y}px`)
    .style('left', `${data[0].x}px`)
    .html(data[0].text);
}