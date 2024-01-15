// Libraries
import Draggable from 'react-draggable';

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
import { EquityIndicator } from '../utils/Types';

function SelectEquityIndicator({equityIndicator, setEquityIndicator} : {equityIndicator: EquityIndicator, setEquityIndicator: any}) : JSX.Element {

  const handleChange = (event: SelectChangeEvent) => {
      setEquityIndicator(selectVariable.equityIndicator.find(d => d.id === event.target.value) as EquityIndicator);
  };

  return (
    <ComponentGroupInner title="Equity indicator">
      <div id="SelectEquityIndicator" className="QueryComponent">
          <FormControl fullWidth size="small">
              <Select
                  id="select-equity-indicator"
                  value={equityIndicator.id}
                  onChange={handleChange}
              >
              {selectVariable.equityIndicator.map((equityIndicator: EquityIndicator) => (
                  <MenuItem key={equityIndicator.id} value={equityIndicator.id}>{equityIndicator.descr}</MenuItem>
              ))}
              </Select>
          </FormControl>
      </div>
    </ComponentGroupInner>
  );
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

export function StateStatus({equityIndicator, setEquityIndicator} : 
                            {equityIndicator: EquityIndicator, setEquityIndicator: any}) {
  return (
    <Status>
      <ComponentGroup title="Legend">
        <SelectEquityIndicator equityIndicator={equityIndicator} setEquityIndicator={setEquityIndicator}/>
        <EquityLegend equityIndicator={equityIndicator}/>
        <StateLegend />
      </ComponentGroup>
    </Status>
  );
}

export function CountyStatus({equityIndicator, setEquityIndicator, showPolls, setShowPolls, showVD, setShowVD} : 
                             {equityIndicator: EquityIndicator, setEquityIndicator: any, 
                              showPolls: boolean, setShowPolls: any, 
                              showVD: boolean, setShowVD: any}) {
    return (
      <Status>
        <ComponentGroup title="Legend">
            <SelectEquityIndicator equityIndicator={equityIndicator} setEquityIndicator={setEquityIndicator}/>
            <EquityLegend equityIndicator={equityIndicator}/>
          <ComponentGroupInner title="Voting districts">
            <VDSwitch showVD={showVD} setShowVD={setShowVD}/>
          </ComponentGroupInner>
          <ComponentGroupInner title="Poll status">
            <PollsSwitch showPolls={showPolls} setShowPolls={setShowPolls}/>
            {showPolls ? <CountyLegend /> : <></>}
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
