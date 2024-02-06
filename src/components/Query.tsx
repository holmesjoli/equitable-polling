// MUI
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';

// Types
import { State, County, ChangeYear, GeoID } from '../utils/Types';

// Globals
import { defaultCounty } from "../utils/Global";

// Styles
import styled from "styled-components";
import { theme } from "../utils/Theme";

export function ComponentGroupInner({title, children}: {title: string, children: React.ReactNode}):  JSX.Element {

    return(
        <div className="ComponentGroupInner">
            <h4>{title}</h4>
            {children}
        </div>
    )
}

export function ComponentGroup({title, children, className=""}: {title: string, children: React.ReactNode, className?: string}):  JSX.Element {

    return(
        <div className={className + " ComponentGroupInner"}>
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

function SelectState({ selectedState, setSelectedState, setSelectedCounty, setGeoJsonId, statesData } : 
                     { selectedState: State, setSelectedState: any, setSelectedCounty: any, setGeoJsonId: any, statesData: GeoJSON.FeatureCollection }) : JSX.Element {

    const handleChange = (event: SelectChangeEvent) => {
        const state = statesData.features.find((d:any) => d.properties!.stfp === event.target.value)!.properties as State;
        setSelectedState(state);
        setSelectedCounty(defaultCounty);
        setGeoJsonId({geoid: state.geoid, type: state.type} as GeoID);
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
                {statesData.features.map((state: GeoJSON.Feature) => (
                    <MenuItem key={state.properties!.stfp} value={state.properties!.stfp}>{state.properties!.name}</MenuItem>
                ))}
                </Select>
            </FormControl>
        </div>
    );
}

function SelectCounty({ selectedState, selectedCounty, setSelectedCounty, setGeoJsonId, countiesData } : 
                      { selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any, setGeoJsonId: any, countiesData: GeoJSON.FeatureCollection} ) : JSX.Element {

    const allOpt = [{type: 'Feature', 
                    properties: {name: 'All counties', geoid: '0'}, 
                    geometry: {} as GeoJSON.Geometry} as GeoJSON.Feature];

    return (
        <div id="SelectCounty" className="QueryComponent">
            <Autocomplete
            id="country-select-demo"
            fullWidth size="small"
            options={allOpt.concat(countiesData.features.filter((d: any) => d.properties.stfp === selectedState.stfp) as GeoJSON.Feature[])}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.properties?.name}
            onChange = {(_, feature) => {
                if (feature === null) {
                    return;
                } else if (feature?.properties?.geoid === '0') {
                    setSelectedCounty(defaultCounty);
                    setGeoJsonId({geoid: selectedState.geoid, type: selectedState.type} as GeoID);
                } else {
                    const properties = feature?.properties;
                    setSelectedCounty(properties as County);
                    setGeoJsonId({geoid: properties!.geoid, type: properties!.type} as GeoID);
                }
            }}
            renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                {option.properties?.name}
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                {...params}
                label={selectedCounty.cntyfp == ""? "County": selectedCounty.name }
                inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                }}
                />
            )}
            />
        </div>
    );
}

function SelectGeography({ selectedState, setSelectedState, selectedCounty, setSelectedCounty, setGeoJsonId, statesData, countiesData } : 
                         { selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any, setGeoJsonId: any, statesData: GeoJSON.FeatureCollection, countiesData: GeoJSON.FeatureCollection }) : JSX.Element {

    return(
        <ComponentGroup title="Select geography">
            <SelectState selectedState={selectedState} setSelectedState={setSelectedState} setSelectedCounty={setSelectedCounty} setGeoJsonId={setGeoJsonId} statesData={statesData}/>
            {selectedState.stfp !== '' ? <SelectCounty selectedState={selectedState} setSelectedState={setSelectedState} selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty} setGeoJsonId={setGeoJsonId} countiesData={countiesData}/>: null}
        </ComponentGroup>
    )
}

function SelectChangeYear({changeYear, setChangeYear, changeYearOpts} : {changeYear: ChangeYear, setChangeYear: any, changeYearOpts: ChangeYear[]}) : JSX.Element {

    const handleChange = (event: SelectChangeEvent) => {
        setChangeYear(changeYearOpts.find(d => d.id === event.target.value) as ChangeYear);
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
                    {changeYearOpts.map((changeYear: ChangeYear) => (
                        <MenuItem key={changeYear.id} value={changeYear.id}>{changeYear.descr}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </div>
        </ComponentGroup>
    )
}

export const Menu = styled.div<{ $geojsonid: GeoID; }>`
    z-index: +9;
    position: absolute;
    top: 10vh;
    left: ${props => props.$geojsonid.type === 'US' ? '-100vw;' : '0vw;'};
    width: 20rem;
    // padding: .625rem;
    background-color: ${theme.backgroundFill};
    transition: left 0.25s cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    overflow-y: auto;
    height: 85vh;
    border-right: 1px solid #B7B7B7;
`;

export function QueryMenu({ geoJsonId, changeYear, setChangeYear, selectedState, setSelectedState, selectedCounty, setSelectedCounty, setGeoJsonId, changeYearOpts, statesData, countiesData} : 
                          { geoJsonId: GeoID, changeYear: ChangeYear, setChangeYear: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any, setGeoJsonId: any, changeYearOpts: ChangeYear[], statesData: GeoJSON.FeatureCollection, countiesData: GeoJSON.FeatureCollection}) {

    return(
        <Menu $geojsonid={geoJsonId}>
            <div className="Query">
                <PageDescription>
                    <p>The mapping page shows an overview of how polling locations have changed over the last decade. Click a specific county to return a more detailed view.</p>
                </PageDescription>
                <SelectGeography selectedState={selectedState} setSelectedState={setSelectedState} selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty} setGeoJsonId={setGeoJsonId} statesData={statesData} countiesData={countiesData}/>
                <SelectChangeYear changeYear={changeYear} setChangeYear={setChangeYear} changeYearOpts={changeYearOpts} />
            </div>
        </Menu>
    );
}
