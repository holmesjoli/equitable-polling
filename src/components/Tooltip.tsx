// Libraries
import * as d3 from 'd3';

// Styles
import { theme, returnSpecificEquityIndicator } from '../utils/Theme';

//Types
import { EquityIndicator, ChangeYear } from '../utils/Types';

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
    return `<div class="ComponentGroupInner SemiBold">${feature.properties.name} ${feature.properties.descr}</div>`;
}

function mouseOverEquityMeasure(feature: GeoJSON.Feature, equityIndicator: EquityIndicator, changeYear: ChangeYear) {
    if(equityIndicator.variable !== 'none') {
        const ei = returnSpecificEquityIndicator(feature, equityIndicator);
        return `<span><span class="SemiBold focusColor">${ei.equityMeasure}${equityIndicator.descr}</span> in base year ${changeYear.baseYear}</span>`;
    } else {
        return '';
    }
}

export function mouseOverTextPoll(d: any) {
    return `<div class="ComponentGroupInner SemiBold">${d.name}</div><div>Status:<span class="${d.overall} SemiBold"> ${d.status}</span></div>`;
}

// todo update back to `${mouseOverGeo(feature)}` when we have more information on the state to add here
export function mouseOverTextVD(feature: any) {
    return `<div class="SemiBold">${feature.properties.name} ${feature.properties.descr}</div>`
}

export function mouseOverTextTract(feature: any, equityIndicator: EquityIndicator, changeYear: ChangeYear) {

    // console.log(feature.properties.changeYearData)

    const tractName = `<div class="ComponentGroupInner SemiBold">${feature.properties.descr} ${feature.properties.name}</div>`;
    const ei = `<div class="DetailInformation">${mouseOverEquityMeasure(feature, equityIndicator, changeYear)}</div>`;

    console.log(feature.properties.changeYearData.pollLocSummary.noPolls);

    const pollLocSummary = feature.properties.changeYearData.pollLocSummary;

    if (pollLocSummary.noPolls) {
        const noPolls = `<div class="DetailInformation">No polling locations in ${changeYear.baseYear}</div>`;
        return `${tractName}${ei}${noPolls}`;
    } else {
        const totalNoPolls = `<div class="DetailInformation"><span class="SemiBold">${pollLocSummary.totalNoPolls} total polling location(s) </span> in ${changeYear.baseYear}</div>`;
        const pollsAdded = pollLocSummary.status.pollsAdded > 0 ? `<div class="DetailInformation"><span class="added SemiBold">${pollLocSummary.status.pollsAdded} poll added </span> in ${changeYear.baseYear}</div>`: ``;
        const pollsRemoved = pollLocSummary.status.pollsRemoved > 0 ? `<div class="DetailInformation"><span class="removed SemiBold">${pollLocSummary.status.pollsRemoved} poll removed </span> in ${changeYear.baseYear}</div>`: ``;
        const pollsNoChange = pollLocSummary.status.pollsNoChange > 0 ? `<div class="DetailInformation"><span class="SemiBold">${pollLocSummary.status.pollsNoChange} polls stayed the same </span> in ${changeYear.baseYear}</div>`: ``;
        return `${tractName}${ei}${totalNoPolls}${pollsAdded}${pollsRemoved}${pollsNoChange}`;
    }
}

export function mouseOverTextCounty(feature: any, equityIndicator: EquityIndicator, changeYear: ChangeYear) {

    const countyName = mouseOverGeo(feature);

    if (feature.properties.changeYearData === undefined) {
        const summary = `<span>Missing data for ${feature.properties.name} ${feature.properties.descr} in base year ${changeYear.baseYear}</span>`;
        return `${countyName}${summary}`;
    } else {
        const ei = `<div class="DetailInformation">${mouseOverEquityMeasure(feature, equityIndicator, changeYear)}</div>`;
        const pollSummary = feature.properties.changeYearData.pollSummary;
        const noChanges = `<div class="DetailInformation"><span class="SemiBold">${pollSummary?.changeNoPolls}</span> poll locations changed</div>`;

        let netChanges;
        if (pollSummary?.overall === 'nochange') {
            netChanges = `<div class="DetailInformation"><span class="SemiBold">No change</span> in the net # of polls between ${changeYear.changeYear}</div>`;
        } else {
            const status = pollSummary?.overall === 'added' ? 'gain': 'loss';
            netChanges = `<div class="DetailInformation">Net<span class="SemiBold ${pollSummary?.overall}"> ${status} of ${Math.abs(pollSummary?.overallChange ?? 0)} </span> poll locations between ${changeYear.changeYear}</div>`;
        }

        return `${countyName}${ei}${noChanges}${netChanges}`;
    }    
}

// keeping two functions in case we need to distinguish between the two tooltips
export function mouseOverTextPollSummary(feature: any, equityIndicator: EquityIndicator, changeYear: ChangeYear) {
    return mouseOverTextCounty(feature, equityIndicator, changeYear);
}

// todo update back to `${mouseOverGeo(feature)}` when we have more information on the state to add here
export function mouseOverTextState(feature: any) {
    return `<div class="SemiBold">${feature.properties.name} ${feature.properties.descr}</div>`
}
