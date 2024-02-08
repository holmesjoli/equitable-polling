import React, { useEffect } from 'react';
import * as d3 from 'd3';

// Styles
import { layersStyle, theme } from "../utils/Theme";

const selector = "root";

// Reusable function to initialize svg
export function init() {
    d3.select(`#${selector}`)
      .append('svg')
      .attr('class', 'Annotation')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('position', 'absolute')
      .style('top', '0px')
      .style('left', '0px');
}

export function updateAnnotation() {

    const data = [{x: 100, y: 200, text: "Test", id: 1}]

    const svg = d3.select(`.Annotation`);

    svg
    .selectAll('text')
    .data(data, (d: any) => d.id)
    .join(
        (enter: any) => enter
        .append('text')
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y)
        .text((d: any) => d.text)
        .style('font-size', 16)
        .style('fill', 'black')
    );
}