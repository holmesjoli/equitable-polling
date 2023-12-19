import * as d3 from 'd3';

const sizeLegendId = 'Size-Legend';
const colorLegendId = 'Color-Legend';
const width = 216;

function initLegend(selector: string) {
    d3.select(`#${selector}`)
      .append('svg')
      .attr('width', width);
}

function legendHeight(data: []) {
    const height = 25 + (data.length) * 20;
    return height;
}

export default function Status ({children}: {children: any}) {

    return (
        <div className="Legend">
            {children}
        </div>
    );
}
