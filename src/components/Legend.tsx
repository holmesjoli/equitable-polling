// Components
import { ComponentGroupInner } from "./Query";

// Libraries
import { useEffect } from 'react';
import * as d3 from 'd3';

const sizeLegendId = 'Size-Legend';
const colorLegendId = 'Color-Legend';
const width = 216;

function initLegend(selector: string) {
    d3.select(`.Legend #${selector}`)
      .append('svg')
      .attr('width', width);
}

function legendHeight(data: any[]) {
    const height = 25 + (data.length) * 20;
    return height;
}

function initSizeLegend() {

    const data = [{'rSize': 3, 'label': '0' },
                  {'rSize': 5, 'label': "Between 0 and 10" },
                  {'rSize': 10, 'label': "Between 10 and 20" },
                  {'rSize': 15, 'label': "Between 20 and 20" }];

    initLegend(sizeLegendId);
  
    const svg = d3.select(`#${sizeLegendId} svg`)
      .attr('height', legendHeight(data));

      svg
      .selectAll('path')
      .data(data, (d: any) => d.rSize)
      .join(
        enter => enter
          .append('circle')
          .attr('r', d => d.rSize)
          .attr('transform', function (d, i) {
            return 'translate(' + 17 + ', ' + (i * 27 + 15) + ')';
          })
          .attr('fill', "#C6C6C6")
          .attr("stroke", "#757575")
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
          .attr('x', 35)
          .attr('y', (d, i) => i * 27 + 20)
          .text(d => d.label)
          .attr('font-size', 12)
          .attr('fill', "#757575")
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
        <div id={sizeLegendId}></div>
      </ComponentGroupInner>
    );
}

export function StateLegend () {
    // Initiate legends
    useEffect(() => {
        initSizeLegend();
        // initLegend(colorLegendId);
    }, []);

    return (
        <div className="Legend">
            <div className="inner">
                <SizeType />
                <ColorType />
            </div>
        </div>
    );
}
