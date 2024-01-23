// Libraries
import { useEffect } from 'react';
import * as d3 from 'd3';

// Components
import { ComponentGroupInner } from "./Query";
import {  theme } from "../utils/Theme";
import { pollFillScale, pollStrokeScale, rScale, thresholdScale,
         sizeData, equityIndicatorData } from "../utils/Scales";

// Types
import { EquityIndicator } from '../utils/Types';

const equityLegendId = 'Equity-Legend';
const sizeLegendId = 'Size-Legend';
const colorLegendId = 'Color-Legend';
const width = 200;

const circleStart = 17;

const textStart = circleStart + 20;

// Reusable function to initialize legend
function initLegend(selector: string) {
  d3.select(`.Legend #${selector}`)
    .append('svg')
    .attr('width', width);
}

// Reusable function to add text to legend
function legendText(svg: any, data: any[]) {
  svg
    .selectAll('text')
    .data(data, (d: any) => d.id)
    .join(
      (enter: any) => enter
        .append('text')
        .attr('x', textStart)
        .attr('y', (d: any, i: number) => i * 23 + 20)
        .text((d: any) => d.label)
        .attr('font-size', theme.fontSize)
        .attr('fill', theme.grey.primary)
        // ,
      // update => update
      //   .attr('opacity', d => viewHoverValue === "" || d.color === viewHoverValue ? 1 : 0.3),
      // exit => exit.remove()
    );
}

// Calculate legend height according to number of items in the data to represent
function legendHeight(data: any[], margin: number = 0) {
  const height = margin + (data.length) * 24;
  return height;
}

// Initiate size legend
function initSizeLegend() {

  initLegend(sizeLegendId);

  const svg = d3.select(`#${sizeLegendId} svg`)
    .attr('height', legendHeight(sizeData, 15));

  svg
  .selectAll('circle')
  .data(sizeData, (d: any) => d.rSize)
  .join(
    enter => enter
      .append('circle')
      .attr('r', d => rScale(d.rSize))
      .attr('transform', function (d, i) {

        let x = sizeData.filter(e => e.rSize < d.rSize).map(e => e.rSize).reduce((a, b) => a + b, 0);

        return 'translate(' + circleStart + ', ' + (i * 16 + x + rScale(d.rSize) + 8) + ')';
      })
      .attr('fill', theme.grey.secondary)
      .attr("stroke", theme.grey.primary)
      .attr('stroke-width', 1)
    //   ,
    // update => update
    //   .attr('opacity', d => viewHoverValue === "" || d.color === viewHoverValue ? 1 : 0.3),
    // exit => exit.remove()
  );

  svg
    .selectAll('text')
    .data(sizeData, (d: any) => d.rSize)
    .join(
      enter => enter
        .append('text')
        .attr('x', textStart)
        .attr('y', function(d, i) { 

          let x = sizeData.filter(e => e.rSize < d.rSize).map(e => e.rSize).reduce((a, b) => a + b, 0);
          
          return i * 16 + x + rScale(d.rSize) + 8})
        .text(d => d.label)
        .attr('font-size', theme.fontSize)
        .attr('fill', theme.grey.primary)
        .attr('dominant-baseline', 'middle')
        // ,
      // update => update
      //   .attr('opacity', d => viewHoverValue === "" || d.color === viewHoverValue ? 1 : 0.3),
      // exit => exit.remove()
    );
}

// Initiate poll legend
function initPollLegend(geo: string) {
  
const data = [{ overall: 'increase', label: 'Increase of more than 10', id: '3', geo: 'state' },
              { overall: 'increase', label: "Increase of 4 to 10", id: '2', geo: 'state' },
              { overall: 'increase', label: "Increase of 1 to 3" , id: '1', geo: 'state' },
              { overall: 'nochange', label: "No change", id: '0', geo: 'state' },
              { overall: 'decrease', label: "Decrease of 1 to 3", id: '-1', geo: 'state' },
              { overall: 'decrease', label: "Decrease of 4 to 10", id: '-2', geo: 'state' },
              { overall: 'decrease', label: "Decrease of more than 10", id: '-3', geo: 'state' },
              { overall: 'added', label: 'Added', id: '3', geo: 'county' },
              { overall: 'nochange', label: "No change", id: '0', geo: 'county' },
              { overall: 'decrease', label: "Removed", id: '-3', geo: 'county' }];

  initLegend(colorLegendId);

  const svg = d3.select(`#${colorLegendId} svg`)
    .attr('height', legendHeight(data.filter(d => d.geo === geo)));

  svg
    .selectAll('circle')
    .data(data.filter(d => d.geo === geo), (d: any) => d.id)
    .join(
      enter => enter
        .append('circle')
        .attr('r', 6)
        .attr('transform', function (d, i) {
          return 'translate(' + circleStart + ', ' + (i * 23 + 15) + ')';
        })
        .attr('fill', (d: any) => pollFillScale(d.id) as string) // Add type assertion
        .attr("stroke", (d: any) => pollStrokeScale(d.overall) as string) // Add type assertion
        .attr('stroke-width', 1)
      //   ,
      // update => update
      //   .attr('opacity', d => viewHoverValue === "" || d.color === viewHoverValue ? 1 : 0.3),
      // exit => exit.remove()
  );

  legendText(svg, data.filter(d => d.geo === geo));
}

// Initiate equity legend
function initEquityLegend(equityIndicator: EquityIndicator) {

  const svg = d3.select(`#${equityLegendId} svg`)
    .attr('height', legendHeight(equityIndicatorData.filter(d => d.variable === equityIndicator.variable)));

  svg
    .selectAll('rect')
    .data(equityIndicatorData.filter(d => d.variable === equityIndicator.variable), (d: any) => d.id)
    .join(
      enter => enter
        .append('rect')
        .attr('height', 10)
        .attr('width', 10)
        .attr('transform', function (d, i) {
          return 'translate(' + (circleStart - 6) + ', ' + (i * 23 + 10) + ')';
        })
        .attr('fill', (d: any) => thresholdScale(d.pctBlack) as string)
        .attr("stroke", theme.focusColor)
        .attr('stroke-width', 1)
      //   ,
      // update => update
      //   .attr('opacity', d => viewHoverValue === "" || d.color === viewHoverValue ? 1 : 0.3),
      // exit => exit.remove()
  );

  legendText(svg, equityIndicatorData.filter(d => d.variable === equityIndicator.variable));
}

function SizeTypeState () {
  return (
    <ComponentGroupInner title="# of poll location changes">
      <div id={sizeLegendId}></div>
    </ComponentGroupInner>
  );
}

function ColorTypeState () {
  return (
    <ComponentGroupInner title="Net change in # of polls">
      <div id={colorLegendId}></div>
    </ComponentGroupInner>
  );
}

function ColorTypeCounty () {
  return (
      <div id={colorLegendId}></div>
  );
}

export function StateLegend () {
  // Initiate legends
  useEffect(() => {
    initSizeLegend();
    initPollLegend('state');
  }, []);

  return (
    <div className="Legend">
      <SizeTypeState />
      <ColorTypeState />
    </div>
  );
}

export function CountyLegend () {
  // Initiate legends
  useEffect(() => {
    initPollLegend('county');
  }, []);

  return (
    <div className="Legend">
      <ColorTypeCounty />
    </div>
  );
}

export function EquityLegend ({equityIndicator} : {equityIndicator: EquityIndicator}) {

  useEffect(() => {
    initLegend(equityLegendId);
  }, []);

  // Initiate legends
  useEffect(() => {
    initEquityLegend(equityIndicator);
  }, [equityIndicator]);

  return (
    <div className="Legend">
      <div id={equityLegendId}></div>
    </div>
  );
}
