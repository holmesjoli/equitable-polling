// Libraries
import * as d3 from 'd3';

// Styles
import { theme, returnSpecificEquityIndicator } from '../utils/Theme';

//Types
import {EquityIndicator, ChangeYear} from '../utils/Types';

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

function mouseOverGeo(feature: any) {
    return `${feature.properties.name} ${feature.properties.descr}`;
}

// TODO add this back in
function mouseOverEquityMeasure(feature: any, equityIndicator: EquityIndicator, changeYear: ChangeYear) {
    if(equityIndicator.variable !== 'none') {
        const ei = returnSpecificEquityIndicator(feature, equityIndicator, changeYear);
        return `${ei.equityMeasure}${equityIndicator.descr}`
    } else {
        return '';
    }
}

export function mouseOverTextVD(feature: any) {
    return `<span class="SemiBold">${mouseOverGeo(feature)}</span>`
}

export function mouseOverTextTract(feature: any, equityIndicator: EquityIndicator, changeYear: ChangeYear) {
    return `<span class="SemiBold">${feature.properties.descr} ${feature.properties.name}</span> <br> <span>${mouseOverEquityMeasure(feature, equityIndicator, changeYear)}</span>`
}

export function mouseOverTextCounty(feature: any, equityIndicator: EquityIndicator, changeYear: ChangeYear) {
    return `<span class="SemiBold"> ${mouseOverGeo(feature)}</span> <br> <span>${mouseOverEquityMeasure(feature, equityIndicator, changeYear)}</span>`
}

export function mouseOverTextState(feature: any) {
    return `<span class="SemiBold">${mouseOverGeo(feature)} </span>`
}
