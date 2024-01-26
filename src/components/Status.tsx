// Libraries
import Draggable from 'react-draggable';

// MUI
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

// Components
import { ComponentGroup, ComponentGroupInner } from "./Query";
import { CountyLegend, StateLegend, EquityLegend } from "./Legend";

// Data
import { selectVariable } from "../utils/Global";

// Types
import { EquityIndicator, Indicator, ChangeYear } from '../utils/Types';

function SelectEquityIndicator({equityIndicator, setEquityIndicator} : {equityIndicator: EquityIndicator, setEquityIndicator: any}) : JSX.Element {

  const handleChange = (event: SelectChangeEvent) => {
      setEquityIndicator(selectVariable.equityIndicator.find(d => d.variable === event.target.value) as EquityIndicator);
  };

  return (
    <div id="SelectEquityIndicator">
        <FormControl fullWidth size="small">
            <Select
                id="select-equity-indicator"
                value={equityIndicator.variable}
                onChange={handleChange}
            >
            {selectVariable.equityIndicator.map((equityIndicator: EquityIndicator) => (
                <MenuItem key={equityIndicator.variable} value={equityIndicator.variable}>{equityIndicator.descr}</MenuItem>
            ))}
            </Select>
        </FormControl>
    </div>
  );
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

function PollsSwitch({showPolls, setShowPolls}: {showPolls: boolean, setShowPolls: any}) : JSX.Element {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowPolls(event.target.checked);
    };

    return (
      <div id="polls-switch">
        <FormControlLabel control={<Switch checked={showPolls} onChange={handleChange} />} label="Show/hide" />
      </div>
    );
}

function VDSwitch({showVD, setShowVD}: {showVD: boolean, setShowVD: any}) : JSX.Element {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowVD(event.target.checked);
  };

  return (
    <div id="vd-switch" className="QueryComponent">
      <FormControlLabel control={<Switch checked={showVD} onChange={handleChange} />} label="Show/hide" />
    </div>
  );
}

export function USStatus() {
    return (
      <Status>
        <ComponentGroup className="US" title="Description">
          <p>The goal of the Polling Equity Dashboard is to help users assess which communities could
                benefit from additional access to polling locations. The dashboard was designed by 
                the <a href="https://www.newdata.org/" target="_blank">Center for New Data</a>, a 
                non-partisan non-profit interested in using data to strengthen our democracy. <span className="">Select 
                a outlined state to get started.</span></p>
        </ComponentGroup>
      </Status>
    );
}

export function StateStatus({equityIndicator, setEquityIndicator, geoHover, pollHover, changeYear} : 
                            {equityIndicator: EquityIndicator, setEquityIndicator: any, geoHover: any, pollHover: any, changeYear: ChangeYear}) {
  return (
    <Status>
      <ComponentGroup title="Legend">
        <ComponentGroupInner title="Equity indicator">
          <SelectEquityIndicator equityIndicator={equityIndicator} setEquityIndicator={setEquityIndicator}/>
          {equityIndicator.variable !== "none"?  <EquityLegend equityIndicator={equityIndicator} geoHover={geoHover} changeYear={changeYear}/>: null}
        </ComponentGroupInner>
        <StateLegend pollHover={pollHover}/>
      </ComponentGroup>
    </Status>
  );
}

export function CountyStatus({equityIndicator, setEquityIndicator, showPolls, setShowPolls, showVD, setShowVD, geoHover, pollHover, changeYear} : 
                             {equityIndicator: EquityIndicator, setEquityIndicator: any, changeYear: ChangeYear,
                              showPolls: boolean, setShowPolls: any, 
                              showVD: boolean, setShowVD: any, 
                              geoHover: any, pollHover: any}) {
    return (
      <Status>
        <ComponentGroup title="Legend">
          <ComponentGroupInner title="Equity indicator">
              <SelectEquityIndicator equityIndicator={equityIndicator} setEquityIndicator={setEquityIndicator}/>
              {equityIndicator.variable !== "none"?  <EquityLegend equityIndicator={equityIndicator} geoHover={geoHover} changeYear={changeYear}/>: null}
          </ComponentGroupInner>
          <ComponentGroupInner title="Voting districts">
            <VDSwitch showVD={showVD} setShowVD={setShowVD}/>
          </ComponentGroupInner>
          <ComponentGroupInner title="Poll status">
            <PollsSwitch showPolls={showPolls} setShowPolls={setShowPolls}/>
            {showPolls ? <CountyLegend pollHover={pollHover}/> : <></>}
          </ComponentGroupInner>
        </ComponentGroup>
      </Status>
    );
}

export default function Status ({children}: {children: React.ReactNode}) {
    return (
      <Draggable bounds="body">
        <div className="Status">
            {children}
        </div>
      </Draggable>
    );
}
