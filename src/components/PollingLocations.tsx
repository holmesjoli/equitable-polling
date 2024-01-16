import * as d3 from 'd3';
import { PollingLoc } from '../utils/Types';

import { pollFillScale, pollStrokeScale } from "../utils/Theme";

// Reusable function to initialize legend
export function initPolls() {
    d3.select(`.home-map`)
      .append('svg')
      .attr('class', 'poll-layer')
      .attr('height', '80vh')
      .attr('width', '100vw')
      .attr('z-index', 2000);
}

export function drawPolls(data: PollingLoc[]) {

    const svg = d3.select(`.poll-layer`);

    svg
        .selectAll('circle')
        .data(data, (d: any) => d.rSize)
        .join(
            enter => enter
            .append('circle')
                .attr('r', 6)
                .attr('cx', (d: any) => d.pixelCoord.x)
                .attr('cy', (d: any) => d.pixelCoord.y)
                .attr('fill', (d: any) => pollFillScale(d.id) as string) // Add type assertion
                .attr("stroke", (d: any) => pollStrokeScale(d.overall) as string) // Add type assertion
                .attr('stroke-width', 1)
                .attr('z-index', 2000)
        //   ,
        // update => update
        //   .attr('opacity', d => viewHoverValue === "" || d.color === viewHoverValue ? 1 : 0.3),
        // exit => exit.remove()
  );
}
