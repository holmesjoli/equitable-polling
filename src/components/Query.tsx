// React
import { useEffect, useState } from "react";

// MUI
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TextField from '@mui/material/TextField';

// Types
import { Feature } from "geojson";
import { State, County, ChangeYear, Indicator } from '../utils/Types';

// Globals
import { selectVariable, defaultCounty } from "../utils/Global";



import styled from "styled-components";

// Data
import { nestedStateData } from "../utils/DM";

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

function SelectState({selectedState, setSelectedState, setSelectedCounty} : { selectedState: State, setSelectedState: any, setSelectedCounty: any}) : JSX.Element {

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedState(nestedStateData.features.find(d => d.properties!.stfp === event.target.value)!.properties as State);
        setSelectedCounty(defaultCounty);
    };

    return (
        <div id="SelectState" className="QueryComponent">
            <FormControl fullWidth size="small">
                <InputLabel id="select-state-label">State</InputLabel>
                <Select
                labelId="select-state-label"
                id="select-state"
                value={selectedState.stfp}
                label="State"
                onChange={handleChange}
                >
                {nestedStateData.features.map((state: GeoJSON.Feature) => (
                    <MenuItem key={state.properties!.stfp} value={state.properties!.stfp}>{state.properties!.name}</MenuItem>
                ))}
                </Select>
            </FormControl>
        </div>
    );
}

function SelectCounty({selectedState, selectedCounty, setSelectedCounty} : {selectedState: State, selectedCounty: County, setSelectedCounty: any}) : JSX.Element {

    const [textInput, setTextInput] = useState('');

    const [potentialCounties, setPotentialCounties] = useState(selectedState.counties.features);
    console.log(potentialCounties);

    const handleTextInputChange = (event: any) => {
        setTextInput(event.target.value.toUpperCase());
    };

    // Filter counties based on text input
    useEffect(() => {
        const features: Feature[] = [];

        potentialCounties.forEach((d: GeoJSON.Feature) => {
            if (d.properties?.name.toUpperCase().indexOf(textInput) > -1) {
                features.push(d);
            }

        setPotentialCounties(features);

        if (textInput === '') {
            setPotentialCounties(selectedState.counties.features);
        }

        });
    }, [textInput]);

    const handleChange = (event: SelectChangeEvent) => {

        if (event.target.value === undefined) {
            return
        } else if (event.target.value === '000') {
            setSelectedCounty(defaultCounty);
        } else {
            setSelectedCounty(selectedState.counties.features.find(county => county.properties!.cntyfp === event.target.value)?.properties as County);
        }
    };

    return (
        <div id="SelectCounty" className="QueryComponent">
            <FormControl fullWidth size="small">
                {/* <InputLabel id="select-county-label">County</InputLabel> */}
                <TextField fullWidth size="small" color="secondary"
                    id="outlined-search" label="County" type="search" 
                    onChange={handleTextInputChange}
                />
                <Select
                    labelId="select-county-label"
                    id="select-county"
                    value={selectedCounty.cntyfp}
                    label="county"
                    onChange={handleChange}
                >
                <MenuItem key='000' value='000'>All</MenuItem>
                {potentialCounties.map((county: GeoJSON.Feature) => (
                    <MenuItem key={county.properties!.cntyfp} value={county.properties!.cntyfp}>{county.properties!.name}</MenuItem>
                ))}
                </Select>
            </FormControl>
        </div>
    );
}

function SelectGeography({ selectedState, setSelectedState, selectedCounty, setSelectedCounty} : { selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any}) : JSX.Element {

    return(
        <ComponentGroup title="Select geography">
            <SelectState selectedState={selectedState} setSelectedState={setSelectedState} setSelectedCounty={setSelectedCounty}/>
            {selectedState.stfp !== "" ? <SelectCounty selectedState={selectedState} selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty}/> : null}
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

export const Menu = styled.div<{ $isfullscreen: boolean; }>`
    z-index: +9;
    position: absolute;
    top: 10vh;
    left: ${props => props.$isfullscreen ? '-100vw;' : '0vw;'};
    width: 20rem;
    // padding: .625rem;
    background-color: #FAF6F0;
    transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    overflow-y: auto;
    height: 85vh;
    border-right: 1px solid #B7B7B7;
`;

export function QueryMenu({ isFullScreen, indicator, setIndicator, changeYear, setChangeYear, selectedState, setSelectedState, selectedCounty, setSelectedCounty} : 
                          { isFullScreen: boolean, indicator: Indicator, setIndicator: any, changeYear: ChangeYear, setChangeYear: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any}) {

    return(
        <Menu $isfullscreen={isFullScreen}>
            <div className="Query">
                <PageDescription>
                    <p>The mapping page shows an overview of how polling locations have changed over the last decade. Click a specific county to return a more detailed view.</p>
                </PageDescription>
                <SelectIndicator indicator={indicator} setIndicator={setIndicator} />
                <SelectChangeYear changeYear={changeYear} setChangeYear={setChangeYear} />
                <SelectGeography selectedState={selectedState} setSelectedState={setSelectedState} selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty} />
            </div>
        </Menu>
    );
}
