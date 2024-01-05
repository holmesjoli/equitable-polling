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
import { ComponentGroup } from "./Query";
import { CountyLegend, StateLegend } from "./Legend";

// Data
import { selectVariable } from "../utils/Global";

// Types
import { EquityIndicator } from '../utils/Types';

function SelectEquityIndicator({equityIndicator, setEquityIndicator} : {equityIndicator: EquityIndicator, setEquityIndicator: any}) : JSX.Element {

  const handleChange = (event: SelectChangeEvent) => {
      setEquityIndicator(selectVariable.equityIndicator.find(d => d.id === event.target.value) as EquityIndicator);
  };

  return (
      <div id="SelectEquityIndicator" className="QueryComponent">
          <FormControl fullWidth size="small">
              <InputLabel id="select-equity-indicator-label">Equity Indicator</InputLabel>
              <Select
                  labelId="select-equity-indicator-label"
                  id="select-equity-indicator"
                  value={equityIndicator.id}
                  label="Equity Indicator"
                  onChange={handleChange}
              >
              {selectVariable.equityIndicator.map((equityIndicator: EquityIndicator) => (
                  <MenuItem key={equityIndicator.id} value={equityIndicator.id}>{equityIndicator.descr}</MenuItem>
              ))}
              </Select>
          </FormControl>
      </div>
  );
}

function PollsSwitch({showPolls, setShowPolls}: {showPolls: boolean, setShowPolls: any}) : JSX.Element {
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowPolls(event.target.checked);
    };
  
    return (
      <div id="polls-switch" className="QueryComponent">
        <FormControlLabel control={<Switch checked={showPolls} onChange={handleChange} />} label="Show polls" />
      </div>
    );
}

function VDSwitch({showVD, setShowVD}: {showVD: boolean, setShowVD: any}) : JSX.Element {
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowVD(event.target.checked);
  };

  return (
    <div id="vd-switch" className="QueryComponent">
      <FormControlLabel control={<Switch checked={showVD} onChange={handleChange} />} label="Show voting districts" />
    </div>
  );
}


export function USStatus() {
    return (
      <Status>
        <ComponentGroup title="Description">
          <p>The goal of the Polling Equity Dashboard is to help users assess which communities could
                benefit from additional access to polling locations. The dashboard was designed by 
                the <a href="https://www.newdata.org/" target="_blank">Center for New Data</a>, a 
                non-partisan non-profit interested in using data to strengthen our democracy. <span className="focus">Select 
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
          <PollsSwitch showPolls={showPolls} setShowPolls={setShowPolls}/>
          <VDSwitch showVD={showVD} setShowVD={setShowVD}/>
          <CountyLegend />
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
