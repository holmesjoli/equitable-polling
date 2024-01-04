// Libraries
import { useEffect } from 'react';
import * as d3 from 'd3';

// Components
import { ComponentGroupInner } from "./Query";
import { fillColorScale, strokeColorScale, rScale, grey } from "../utils/Aesthetics";

const sizeLegendId = 'Size-Legend';
const colorLegendId = 'Color-Legend';
const width = 200;

const circleStart = 17;

const textStart = circleStart + 20;

function initLegend(selector: string) {
    d3.select(`.Legend #${selector}`)
      .append('svg')
      .attr('width', width);
}

function legendHeight(data: any[]) {
    const height = 27 + (data.length) * 21;
    return height;
}

function initSizeLegend() {

    const data = [{'rSize': 2, 'label': '0' },
                  {'rSize': 5, 'label': "Between 1 and 5" },
                  {'rSize': 15, 'label': "Between 15 and 30" },
                  {'rSize': 30, 'label': "Greater than 30" }];

    initLegend(sizeLegendId);
  
    const svg = d3.select(`#${sizeLegendId} svg`)
      .attr('height', legendHeight(data));

      svg
      .selectAll('path')
      .data(data, (d: any) => d.rSize)
      .join(
        enter => enter
          .append('circle')
          .attr('r', d => rScale(d.rSize))
          .attr('transform', function (d, i) {

            let x = data.filter(e => e.rSize < d.rSize).map(e => e.rSize).reduce((a, b) => a + b, 0);

            return 'translate(' + circleStart + ', ' + (i * 16 + x + rScale(d.rSize) + 8) + ')';
          })
          .attr('fill', grey.secondary)
          .attr("stroke", grey.primary)
          .attr('stroke-width', 1)
        //   ,
        // update => update
        //   .attr('opacity', d => viewHoverValue === "" || d.color === viewHoverValue ? 1 : 0.3),
        // exit => exit.remove()
      );

    svg
      .selectAll('text')
      .data(data, (d: any) => d.rSize)
      .join(
        enter => enter
          .append('text')
          .attr('x', textStart)
          .attr('y', function(d, i) { 

            let x = data.filter(e => e.rSize < d.rSize).map(e => e.rSize).reduce((a, b) => a + b, 0);
            
            return i * 16 + x + rScale(d.rSize) + 8})
          .text(d => d.label)
          .attr('font-size', 13)
          .attr('fill', grey.primary)
          .attr('dominant-baseline', 'middle')
          // ,
        // update => update
        //   .attr('opacity', d => viewHoverValue === "" || d.color === viewHoverValue ? 1 : 0.3),
        // exit => exit.remove()
      );
}

function initColorLegend() {

  const data = [{'overall': 'increase', 'label': 'Increase of more than 10', id: '3' },
                {'overall': 'increase', 'label': "Increase of 4 to 10", id: '2' },
                {'overall': 'increase', 'label': "Increase of 1 to 3" , id: '1' },
                {'overall': 'nochange', 'label': "No change", id: '0' },
                {'overall': 'decrease', 'label': "Decrease of 1 to 3", id: '-1' },
                {'overall': 'decrease', 'label': "Decrease of 4 to 10", id: '-2' },
                {'overall': 'decrease', 'label': "Decrease of more than 10", id: '-3' }];

  initLegend(colorLegendId);

  const svg = d3.select(`#${colorLegendId} svg`)
    .attr('height', legendHeight(data));

    svg
    .selectAll('path')
    .data(data, (d: any) => d.rSize)
    .join(
      enter => enter
        .append('circle')
        .attr('r', 6)
        .attr('transform', function (d, i) {
          return 'translate(' + circleStart + ', ' + (i * 23 + 15) + ')';
        })
        .attr('fill', (d: any) => fillColorScale(d.id) as string) // Add type assertion
        .attr("stroke", (d: any) => strokeColorScale(d.overall) as string) // Add type assertion
        .attr('stroke-width', 1)
      //   ,
      // update => update
      //   .attr('opacity', d => viewHoverValue === "" || d.color === viewHoverValue ? 1 : 0.3),
      // exit => exit.remove()
    );

  svg
    .selectAll('text')
    .data(data, (d: any) => d.rSize)
    .join(
      enter => enter
        .append('text')
        .attr('x', textStart)
        .attr('y', (d, i) => i * 23 + 20)
        .text(d => d.label)
        .attr('font-size', 13)
        .attr('fill', grey.primary)
        // ,
      // update => update
      //   .attr('opacity', d => viewHoverValue === "" || d.color === viewHoverValue ? 1 : 0.3),
      // exit => exit.remove()
    );

}

function SizeType () {
    return (
      <ComponentGroupInner title="# of poll location changes">
        <div id={sizeLegendId}></div>
      </ComponentGroupInner>
    );
}

function ColorType () {
    return (
      <ComponentGroupInner title="Net change in # of polls">
        <div id={colorLegendId}></div>
      </ComponentGroupInner>
    );
}

export function StateLegend () {
    // Initiate legends
    useEffect(() => {
        initSizeLegend();
        initColorLegend();
    }, []);

    return (
        <div className="Legend">
          <SizeType />
          <ColorType />
        </div>
    );
}
