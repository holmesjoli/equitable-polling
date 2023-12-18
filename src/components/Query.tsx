import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { State, County, ChangeYear } from '../utils/Types';
import geoData from '../data/geoData.json';
import { changeYearData } from "../utils/Global";

export function PageDescription():  JSX.Element {

    return(
        <div className="QueryGroup">
             <h3>Page description</h3>
            <div id="PageDescription" className="QueryComponent">
                <p>
                    The mapping page shows an overview of how polling locations have changed over the last decade. Click a specific county to return a more detailed view.
                </p>
            </div>
        </div>
    )
}

function SelectState({state, setState} : {state: State, setState: any}) : JSX.Element {

    const handleChange = (event: SelectChangeEvent) => {
        setState(geoData.find(d => d.stfp === event.target.value) as State);
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
                {geoData.map((state: State) => (
                    <MenuItem key={state.stfp} value={state.stfp}>{state.stname}</MenuItem>
                ))}
                </Select>
            </FormControl>
        </div>
    );
}

function SelectCounty({state, county, setCounty} : {state: State, county: County, setCounty: any}) : JSX.Element {

    const handleChange = (event: SelectChangeEvent) => {
        setCounty(state.counties.find(d => d.cntyfp === event.target.value) as County);
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
                {state.counties.map((county: County) => (
                    <MenuItem key={county.cntyfp} value={county.cntyfp}>{county.cntyname}</MenuItem>
                ))}
                </Select>
            </FormControl>
        </div>
    );
}

export function SelectGeography({state, setState, county, setCounty} : {state: State, setState: any, county: County, setCounty: any}) : JSX.Element {

    return(
        <div className="QueryGroup">
            <h3>Select geography</h3>
            <SelectState state={state} setState={setState}/>
            {state.stfp !== "" ? <SelectCounty state={state} county={county} setCounty={setCounty}/> : null}
        </div>
    )
}

export function SelectChangeYear({changeYear, setChangeYear} : {changeYear: ChangeYear, setChangeYear: any}) : JSX.Element {

    const handleChange = (event: SelectChangeEvent) => {
        setChangeYear(changeYearData.find(d => d.id === event.target.value) as ChangeYear);
    };

    return(
        <div className="QueryGroup">
            <h3>Select year</h3>
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
                        {changeYearData.map((changeYear: ChangeYear) => (
                            <MenuItem key={changeYear.id} value={changeYear.id}>{changeYear.changeYear}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </div>
        </div>
    )
}
