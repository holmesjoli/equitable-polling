import * as d3 from 'd3';

const selector = "root";

export function init() {
    const tooltip = d3.select(`#${selector}`)
            .append('div')
            .attr('class', 'tooltip')
            .style('max-width', '175px')
            .style('position', 'absolute')
            .style('left', '0px')
            .style('top', '0px')
            .style('visibility', 'hidden')
            .style('padding', '7px')
            .style('pointer-events', 'none')
            .style('border-radius', '5px')
            .style('background-color', 'rgba(250, 246, 240, .9)')
            .style('font-weight', 'normal')
            .style('border', '1px solid #757575')
            // .style('font-family', Theme.tooltipStyles.fontFamily)
            .style('font-size', 13)
            .style('color', '#757575')
            // .style('line-height', Theme.tooltipStyles.lineHeight);

    return tooltip;
}

export function pointerOver(x: number, y: number, str: string) {
    d3.select(`#${selector} .tooltip`)
        .style('visibility', 'visible')
        .style('top', `${y}px`)
        .style('left', `${x}px`)
        .html(str);
}

export function pointerOut() {
    d3.select(`#${selector} .tooltip`)
        .style('visibility', 'hidden');
}
