// Libraries
import * as d3 from 'd3';

// Styles
import { theme, choroplethStyle } from '../utils/Theme';

const selector = "root";

export function init() {
    const tooltip = d3.select(`#${selector}`)
            .append('div')
            .attr('class', 'tooltip')
            .style('max-width', '175px')
            .style('position', 'absolute')
            .style('top', '0px')
            .style('left', '0px')
            .style('visibility', 'hidden')
            .style('padding', '7px')
            .style('pointer-events', 'none')
            .style('border-radius', '5px')
            .style('background-color', 'rgba(250, 246, 240, .9)')
            .style('font-weight', 'normal')
            .style('border', `1.5px solid ${theme.grey.primary}`)
            .style('font-family', theme.fontFamily)
            .style('font-size', theme.fontSize)
            .style('color', theme.grey.primary)
            // .style('line-height', Theme.tooltipStyles.lineHeight);

    return tooltip;
}

export function pointerOver(x: number, y: number, str: string) {

    const nav: HTMLElement | null = d3.select(`.Navigation`).node() as HTMLElement | null;
    const navHeight = nav?.getBoundingClientRect().height;

    y = y + navHeight! - 20;

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

export function mouseOut(event: any) {
    var layer = event.target;
    layer.setStyle(choroplethStyle(layer.feature));
    pointerOut();
    // d3.select(".Status .ComponentGroupInner span").attr("class", "");
}

function mouseOverGeo(properties: any) {
    return `${properties.name} ${properties.descr} <br>`;
}

function mouseOverEquityMeasure(properties: any) {
    if(properties.equityIndicator.variable !== 'none') {
        return `${properties.equityIndicator.equityMeasure}${properties.equityIndicator.descr}`
    } else {
        return '';
    }
}

export function mouseOverTextVD(properties: any) {
    return `<span class="SemiBold">${mouseOverGeo(properties)}</span>`
}

export function mouseOverTextTract(properties: any) {
    return `<span class="SemiBold">${properties.descr} ${properties.name}</span> <br> <span>${mouseOverEquityMeasure(properties)}</span>`
}

export function mouseOverTextCounty(properties: any) {
    return `<span class="SemiBold"> ${mouseOverGeo(properties)}</span> <br> <span>${mouseOverEquityMeasure(properties)}</span>`
}

export function mouseOverTextState(properties: any) {
    return `<span class="SemiBold">${mouseOverGeo(properties)} </span>`
}
