import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { State, County, ChangeYear, Indicator } from '../utils/Types';
import { selectVariable, defaultCounty } from "../utils/Global";

import styled from "styled-components";

export function ComponentGroupInner({title, children}: {title: string, children: React.ReactNode}):  JSX.Element {

    return(
        <div className="ComponentGroupInner">
            <h3>{title}</h3>
            {children}
        </div>
    )
}

export function ComponentGroup({title, children}: {title: string, children: React.ReactNode}):  JSX.Element {

    return(
        <div className="ComponentGroup">
            <h3>{title}</h3>
            {children}
        </div>
    )
}

export function PageDescription({children}: {children: React.ReactNode}):  JSX.Element {

    return(
        <ComponentGroup title="Description">
            <div id="PageDescription" className="QueryComponent">
                {children}
            </div>
        </ComponentGroup>
    )
}

function SelectState({usData, state, setState, setCounty} : {usData: GeoJSON.FeatureCollection, state: State, setState: any, setCounty: any}) : JSX.Element {

    const handleChange = (event: SelectChangeEvent) => {
        setState(usData.features.find(d => d.properties!.stfp === event.target.value)!.properties as State);
        setCounty(defaultCounty);
    };

    return (
        <div id="SelectState" className="QueryComponent">
            <FormControl fullWidth size="small">
                <InputLabel id="select-state-label">State</InputLabel>
                <Select
                labelId="select-state-label"
                id="select-state"
                value={state.stfp}
                label="State"
                onChange={handleChange}
                >
                {usData.features.map((state: GeoJSON.Feature) => (
                    <MenuItem key={state.properties!.stfp} value={state.properties!.stfp}>{state.properties!.name}</MenuItem>
                ))}
                </Select>
            </FormControl>
        </div>
    );
}

function SelectCounty({state, county, setCounty} : {state: State, county: County, setCounty: any}) : JSX.Element {

    const handleChange = (event: SelectChangeEvent) => {
        setCounty(state.counties.features.find(county => county.properties!.cntyfp === event.target.value)?.properties as County);
    };

    return (
        <div id="SelectCounty" className="QueryComponent">
            <FormControl fullWidth size="small">
                <InputLabel id="select-county-label">County</InputLabel>
                <Select
                labelId="select-county-label"
                id="select-county"
                value={county.cntyfp}
                label="county"
                onChange={handleChange}
                >
                {state.counties.features.map((county: GeoJSON.Feature) => (
                    <MenuItem key={county.properties!.cntyfp} value={county.properties!.cntyfp}>{county.properties!.name}</MenuItem>
                ))}
                </Select>
            </FormControl>
        </div>
    );
}

function SelectGeography({usData, state, setState, county, setCounty} : {usData: GeoJSON.FeatureCollection, state: State, setState: any, county: County, setCounty: any}) : JSX.Element {

    return(
        <ComponentGroup title="Select geography">
            <SelectState usData={usData} state={state} setState={setState} setCounty={setCounty}/>
            {state.stfp !== "" ? <SelectCounty state={state} county={county} setCounty={setCounty}/> : null}
        </ComponentGroup>
    )
}

function SelectChangeYear({changeYear, setChangeYear} : {changeYear: ChangeYear, setChangeYear: any}) : JSX.Element {

    const handleChange = (event: SelectChangeEvent) => {
        setChangeYear(selectVariable.changeYear.find(d => d.id === event.target.value) as ChangeYear);
    };

    return(
        <ComponentGroup title="Select year">
            <div id="SelectChangeYear" className="QueryComponent">
                <FormControl fullWidth size="small">
                    <InputLabel id="select-change-year-label">Year</InputLabel>
                    <Select
                    labelId="select-change-year-label"
                    id="select-change-year"
                    value={changeYear.id}
                    label="county"
                    onChange={handleChange}
                    >
                    {selectVariable.changeYear.map((changeYear: ChangeYear) => (
                        <MenuItem key={changeYear.id} value={changeYear.id}>{changeYear.descr}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </div>
        </ComponentGroup>
    )
}

function SelectIndicator({indicator, setIndicator} : {indicator: Indicator, setIndicator: any}) : JSX.Element {

    const handleChange = (event: SelectChangeEvent) => {
        setIndicator(selectVariable.indicator.find(d => d.id === event.target.value) as Indicator);
    };

    return(
        <ComponentGroup title="Select indicator">
            <div id="SelectIndicator" className="QueryComponent">
                <FormControl fullWidth size="small">
                    <InputLabel id="select-indicator-label">Indicator</InputLabel>
                    <Select
                    labelId="select-indicator-label"
                    id="select-indicator"
                    value={indicator.id}
                    label="indicator"
                    onChange={handleChange}
                    >
                    {selectVariable.indicator.map((indicator: Indicator) => (
                        <MenuItem key={indicator.id} value={indicator.id}>{indicator.descr}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </div>
        </ComponentGroup>
    )
}

export const Menu = styled.div<{ isfullscreen: string; }>`
    z-index: +9;
    position: absolute;
    top: 10vh;
    left: ${props => props.isfullscreen === "true" ? '-100vw;' : '0vw;'};
    width: 20rem;
    // padding: .625rem;
    background-color: #FAF6F0;
    transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    overflow-y: auto;
    height: 85vh;
    border-right: 1px solid #B7B7B7;
`;

export function QueryMenu({usData, isFullScreen, indicator, setIndicator, changeYear, setChangeYear, state, setState, county, setCounty} : 
                          {usData: GeoJSON.FeatureCollection, isFullScreen: boolean, indicator: Indicator, setIndicator: any, changeYear: ChangeYear, setChangeYear: any, state: State, setState: any, county: County, setCounty: any}) {

    return(
        <Menu isfullscreen={isFullScreen.toString()}>
            <div className="Query">
                <PageDescription>
                    <p>The mapping page shows an overview of how polling locations have changed over the last decade. Click a specific county to return a more detailed view.</p>
                </PageDescription>
                <SelectIndicator indicator={indicator} setIndicator={setIndicator} />
                <SelectChangeYear changeYear={changeYear} setChangeYear={setChangeYear} />
                <SelectGeography usData={usData} state={state} setState={setState} county={county} setCounty={setCounty} />
            </div>
        </Menu>
    )
}
