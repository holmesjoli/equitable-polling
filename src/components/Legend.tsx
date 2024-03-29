// Libraries
import { useEffect } from 'react';
import * as d3 from 'd3';

// Components
import { ComponentGroupInner } from "./Query";
import { theme, pollFillScale, pollStrokeScale, rScale, thresholdScale,
         sizeData, equityIndicatorData, changeNoPollsThresholdScale } from "../utils/Theme";

// Types
import { EquityIndicator, ChangeYear } from '../utils/Types';

const equityLegendId = 'Equity-Legend';
const sizeLegendId = 'Size-Legend';
const pollLegendId = 'Poll-Legend';
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
function legendText(svg: any, data: any[], id: string | undefined = undefined, geo: boolean = false) {
  svg
    .selectAll('text')
    .data(data, (d: any) => geo? d.baseYearPctBlack: d.id)
    .join(
      (enter: any) => enter
        .append('text')
        .attr('x', textStart)
        .attr('y', (d: any, i: number) => i * 23 + 20)
        .text((d: any) => d.label)
        .attr('font-size', theme.fontSize)
        .attr('fill', theme.grey.primary),
      (update: any) => update
        .attr('opacity', (d: any) => geo ? thresholdScale(d.pctBlack) as string === id as string || id === undefined ? theme.highlightOpacity : theme.nonHighlightOpacity : d.id === id || id === undefined? 1 : theme.nonHighlightOpacity)
    );
}

// Calculate legend height according to number of items in the data to represent
function legendHeight(data: any[], margin: number = 0) {
  const height = margin + (data.length) * 24;
  return height;
}

// Initiate size legend
function updateSizeLegend(pollHover: any, changeYear: ChangeYear) {

  let threshold: number | undefined = undefined;

  if (pollHover.changeYearData !== undefined ) {
    let pollSummary = pollHover.changeYearData.pollSummary;

    threshold = changeNoPollsThresholdScale(pollSummary.changeNoPolls);
  } else {
    threshold = undefined;
  }

  const svg = d3.select(`#${sizeLegendId} svg`)
    .attr('height', legendHeight(sizeData, 15));

  svg
  .selectAll('circle')
  .data(sizeData, (d: any) => d.id)
  .join(
    (enter: any) => enter
      .append('circle')
      .attr('r', (d: any) => rScale(d.threshold))
      .attr('transform', function (d: any, i: any) {
        let x = sizeData.filter(e => e.threshold < d.threshold).map(e => e.threshold).reduce((a, b) => a + b, 0);
        return 'translate(' + circleStart + ', ' + (i * 16 + x + rScale(d.threshold) + 8) + ')';
      })
      .attr('fill', theme.grey.secondary)
      .attr("stroke", theme.grey.primary)
      .attr('stroke-width', 1),
    (update: any) => update
      .attr('opacity', (d: any) => d.threshold === threshold || threshold === undefined? 1 : theme.nonHighlightOpacity)
  );

  svg
    .selectAll('text')
    .data(sizeData, (d: any) => d.threshold)
    .join(
      (enter: any) => enter
        .append('text')
        .attr('x', textStart)
        .attr('y', function(d: any, i: any) { 
          let x = sizeData.filter(e => e.threshold < d.threshold).map(e => e.threshold).reduce((a, b) => a + b, 0);
          return i * 16 + x + rScale(d.threshold) + 8})
        .text((d: any) => d.label)
        .attr('font-size', theme.fontSize)
        .attr('fill', theme.grey.primary)
        .attr('dominant-baseline', 'middle'),
      (update: any) => update
      .attr('opacity', (d: any) => d.threshold === threshold || threshold === undefined? 1 : theme.nonHighlightOpacity)
    );
}

// Initiate poll legend
function updatePollLegend(geo: string, pollHover: any, changeYear: ChangeYear) {

  let id: string | undefined = undefined;

  if (pollHover.type === "County" ) {

    if (pollHover.changeYearData === undefined) { // todo remove this ifelse once we have data for all counties
      id = undefined;
    } else {
      id = pollHover.changeYearData.pollSummary.statusNumeric;
    }

  } else if (pollHover.type === "Poll") {
    id = pollHover.statusNumeric;
  }else {
    id = undefined;
  }

  const data = [{ id: 1, status: 'Added', label: 'Added 10 or more polls', statusNumeric: '3', geo: 'state' },
                { id: 2, status: 'Added', label: "Added between 4 and 10 polls", statusNumeric: '2', geo: 'state' },
                { id: 3, status: 'Added', label: "Added between 1 and 3 polls" , statusNumeric: '1', geo: 'state' },
                { id: 4, status: 'No change', label: "No change", statusNumeric: '0', geo: 'state' },
                { id: 5, status: 'Removed', label: "Removed between 1 and 3", statusNumeric: '-1', geo: 'state' },
                { id: 6, status: 'Removed', label: "Removed between 4 and 10", statusNumeric: '-2', geo: 'state' },
                { id: 7, status: 'Removed', label: "Removed 10 or more polls", statusNumeric: '-3', geo: 'state' },
                { id: 8, status: 'Added', label: 'Added', statusNumeric: '3', geo: 'county' },
                { id: 9, status: 'No change', label: "No change", statusNumeric: '0', geo: 'county' },
                { id: 10, status: 'Removed', label: "Removed", statusNumeric: '-3', geo: 'county' }];

  const svg = d3.select(`#${pollLegendId} svg`)
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
        .attr('fill', (d: any) => pollFillScale(d.statusNumeric) as string) // Add type assertion
        .attr("stroke", (d: any) => pollStrokeScale(d.status) as string) // Add type assertion
        .attr('stroke-width', 1),
      update => update
        .attr('opacity', (d: any) => d.statusNumeric === id || id === undefined? 1 : theme.nonHighlightOpacity)
  );

  legendText(svg, data.filter(d => d.geo === geo), id);
}

// Initiate equity legend
function updateEquityLegend(equityIndicator: EquityIndicator, geoHover: any) {

  let fillColor: string | undefined = undefined;

  if (geoHover.changeYearData  !== undefined ) {

    if (geoHover.changeYearData[equityIndicator.variable] !== undefined) {
      fillColor = geoHover.changeYearData[equityIndicator.variable].fillColor;
    } else {
      fillColor = undefined;
    }
  } else {
    fillColor = undefined;
  }

  const svg = d3.select(`#${equityLegendId} svg`)
    .attr('height', legendHeight(equityIndicatorData.filter(d => d.variable === equityIndicator.variable)));

  svg
    .selectAll('rect')
    .data(equityIndicatorData.filter(d => d.variable === equityIndicator.variable), (d: any) => d.baseYearPctBlack)
    .join(
      enter => enter
        .append('rect')
        .attr('height', 10)
        .attr('width', 10)
        .attr('transform', function (d, i) {
          return 'translate(' + (circleStart - 6) + ', ' + (i * 23 + 10) + ')';
        })
        .attr('opacity', theme.highlightOpacity)
        .attr('fill', (d: any) => thresholdScale(d.pctBlack) as string)
        .attr("stroke", theme.darkGradientColor)
        .attr('stroke-width', 1),
      update => update
        .attr('opacity', (d: any) => thresholdScale(d.pctBlack) as string === fillColor as string || fillColor === undefined ? theme.highlightOpacity : theme.nonHighlightOpacity
        )
  );

  legendText(svg, equityIndicatorData.filter(d => d.variable === equityIndicator.variable), fillColor, true);
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
      <div id={pollLegendId}></div>
    </ComponentGroupInner>
  );
}

function ColorTypeCounty () {
  return (
      <div id={pollLegendId}></div>
  );
}

export function StateLegend ({pollHover, changeYear} : {pollHover: any, changeYear: ChangeYear}) {

  // Initiate legends
  useEffect(() => {
    initLegend(pollLegendId);
    initLegend(sizeLegendId);
  }, []);

  // Initiate legends
  useEffect(() => {
    updatePollLegend('state', pollHover, changeYear);
    updateSizeLegend(pollHover, changeYear);
  }, [pollHover]);

  return (
    <div className="Legend">
      <SizeTypeState />
      <ColorTypeState />
    </div>
  );
}

export function CountyLegend ({pollHover, changeYear} : {pollHover: any, changeYear: ChangeYear}) {
  // Initiate legends
  useEffect(() => {
    initLegend(pollLegendId);
  }, []);

  // Initiate legends
  useEffect(() => {
    updatePollLegend('county', pollHover, changeYear);
  }, [pollHover]);

  return (
    <div className="Legend">
      <ColorTypeCounty />
    </div>
  );
}

export function EquityLegend ({equityIndicator, geoHover} : {equityIndicator: EquityIndicator, geoHover: any}) {

  useEffect(() => {
    initLegend(equityLegendId);
  }, []);

  // Initiate legends
  useEffect(() => {
    updateEquityLegend(equityIndicator, geoHover);
  }, [equityIndicator, geoHover]);

  return (
    <div className="Legend">
      <div id={equityLegendId}></div>
    </div>
  );
}
