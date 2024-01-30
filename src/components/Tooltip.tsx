// Libraries
import * as d3 from 'd3';

// Styles
import { theme, returnSpecificEquityIndicator } from '../utils/Theme';

//Types
import { EquityIndicator, ChangeYear, ChangeYearEquityIndicator } from '../utils/Types';

const selector = "root";

export function init() {
    const tooltip = d3.select(`#${selector}`)
            .append('div')
            .attr('class', 'tooltip')
            .style('max-width', '200px')
            .style('position', 'absolute')
            .style('top', '0px')
            .style('left', '0px')
            .style('visibility', 'hidden')
            .style('padding', '7px')
            .style('pointer-events', 'none')
            .style('border-radius', '5px')
            .style('background-color', 'rgba(250, 246, 240, .85)')
            .style('font-weight', 'normal')
            .style('border', `1.5px solid ${theme.grey.primary}`)
            .style('font-family', theme.fontFamily)
            .style('font-size', `${theme.fontSize}px`)
            .style('color', theme.grey.primary)
            .style('line-height', theme.lineHeight);

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

function mouseOverEquityMeasure(changeYearEquityIndicator: ChangeYearEquityIndicator[], equityIndicator: EquityIndicator, changeYear: ChangeYear) {
    if(equityIndicator.variable !== 'none') {
        const ei = returnSpecificEquityIndicator(changeYearEquityIndicator, equityIndicator, changeYear);
        return `<span><span class="SemiBold focusColor">${ei.equityMeasure}${equityIndicator.descr}</span> in base year ${changeYear.baseYear}</span>`;
    } else {
        return '';
    }
}

export function mouseOverTextPollSummary(d: any, equityIndicator: EquityIndicator, changeYear: ChangeYear) {

    const countyName = `<div class="SemiBold ComponentGroupInner">${d.name} County</div>`;
    const noChanges = `<div class="DetailInformation"><span class="SemiBold">${d.changeNoPolls}</span> poll locations changed</div>`;
    let netChanges;
    let ei;

    if (d.properties !== undefined) {
        ei = `<div class="DetailInformation">${mouseOverEquityMeasure(d.properties.changeYearEquityIndicator, equityIndicator, changeYear)}</div>`;
    } else {
        ei = `<div class="DetailInformation">${mouseOverEquityMeasure(d.changeYearEquityIndicator, equityIndicator, changeYear)}</div>`
    }

    if (d.overall === 'nochange') {
        netChanges = `<div>No change in the net # of polls between ${d.changeYear}</div>`;
    } else {
        const status = d.overall === 'added' ? 'gain': 'loss';
        netChanges = `<div>Net <span class="SemiBold ${d.overall}">${status} of ${Math.abs(d.overallChange)} </span> poll locations between ${d.changeYear}</div>`;
    }

    return `${countyName}${ei}${noChanges}${netChanges}`;
}

export function mouseOverTextPoll(d: any) {
    return `<span class="SemiBold">${d.name}</span><br>Status:<span class=${d.overall}> ${d.status}</span>`;
}

export function mouseOverTextVD(feature: any) {
    return `<span class="SemiBold">${mouseOverGeo(feature)}</span>`
}

export function mouseOverTextTract(feature: any, equityIndicator: EquityIndicator, changeYear: ChangeYear) {
    return `<span class="SemiBold">${feature.properties.descr} ${feature.properties.name}</span> <br> <span>${mouseOverEquityMeasure(feature.properties.changeYearEquityIndicator, equityIndicator, changeYear)}</span>`
}

export function mouseOverTextCounty(feature: any, equityIndicator: EquityIndicator, changeYear: ChangeYear) {
    return `<span class="SemiBold"> ${mouseOverGeo(feature)}</span> <br> <span>${mouseOverEquityMeasure(feature.properties.changeYearEquityIndicator, equityIndicator, changeYear)}</span>`
}

export function mouseOverTextState(feature: any) {
    return `<span class="SemiBold">${mouseOverGeo(feature)} </span>`
}
