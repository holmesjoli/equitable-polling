// Libraries
import * as d3 from 'd3';

// Styles
import { theme, returnSpecificEquityIndicator } from '../utils/Theme';

//Types
import { EquityIndicator, ChangeYear, ChangeYearData } from '../utils/Types';

// Helper functions
import { filterPollSummaryByChangeYear } from "../utils/Helper";

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

function mouseOverEquityMeasure(changeYearData: ChangeYearData[], equityIndicator: EquityIndicator, changeYear: ChangeYear) {
    if(equityIndicator.variable !== 'none') {
        const ei = returnSpecificEquityIndicator(changeYearData, equityIndicator, changeYear);
        return `<span><span class="SemiBold focusColor">${ei.equityMeasure}${equityIndicator.descr}</span> in base year ${changeYear.baseYear}</span>`;
    } else {
        return '';
    }
}

export function mouseOverTextPollSummary(feature: any, equityIndicator: EquityIndicator, changeYear: ChangeYear) {

    const countyName = `<div class="ComponentGroupInner>${mouseOverGeo(feature)}</div>`;
    const ei = `<div class="DetailInformation">${mouseOverEquityMeasure(feature.properties.changeYearData, equityIndicator, changeYear)}</div>`;
    const pollSummary = filterPollSummaryByChangeYear(feature.properties.changeYearData, changeYear);
    const noChanges = `<div class="DetailInformation"><span class="SemiBold">${pollSummary?.changeNoPolls}</span> poll locations changed</div>`;

    let netChanges;
    if (pollSummary?.overall === 'nochange') {
        netChanges = `<div class="DetailInformation">No change in the net # of polls between ${changeYear.changeYear}</div>`;
    } else {
        const status = pollSummary?.overall === 'added' ? 'gain': 'loss';
        netChanges = `<div class="DetailInformation">Net<span class="SemiBold ${pollSummary?.overall}"> ${status} of ${Math.abs(pollSummary?.overallChange ?? 0)} </span> poll locations between ${feature.properties.changeYear}</div>`;
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
    return `<span class="SemiBold">${feature.properties.descr} ${feature.properties.name}</span> <br> <span>${mouseOverEquityMeasure(feature.properties.changeYearData, equityIndicator, changeYear)}</span>`
}

export function mouseOverTextCounty(feature: any, equityIndicator: EquityIndicator, changeYear: ChangeYear) {
    return mouseOverTextPollSummary(feature, equityIndicator, changeYear);
}

export function mouseOverTextState(feature: any) {
    return `<span class="SemiBold">${mouseOverGeo(feature)} </span>`
}
