// Libraries
import Draggable from 'react-draggable';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// Components
import { ComponentGroup } from "./Query";
import { StateLegend } from "./Legend";

// Data
import { equityIndicatorData } from "../utils/Global";

// Types
import { EquityIndicator } from '../utils/Types';

function SelectEquityIndicator({equityIndicator, setEquityIndicator} : {equityIndicator: EquityIndicator, setEquityIndicator: any}) : JSX.Element {

  const handleChange = (event: SelectChangeEvent) => {
      setEquityIndicator(equityIndicatorData.find(d => d.id === event.target.value) as EquityIndicator);
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
              {equityIndicatorData.map((equityIndicator: EquityIndicator) => (
                  <MenuItem key={equityIndicator.id} value={equityIndicator.id}>{equityIndicator.descr}</MenuItem>
              ))}
              </Select>
          </FormControl>
      </div>
  );
}


export function USStatus() {
    return (
      <Status>
        <ComponentGroup title="Legend">
          <p>The goal of the Polling Equity Dashboard is to help users assess which communities could
                benefit from additional access to polling locations. The dashboard was designed by 
                the <a href="https://www.newdata.org/" target="_blank">Center for New Data</a>, a 
                non-partisan non-profit interested in using data to strengthen our democracy. <b>Select 
                a <span className="focus">highlighted</span> state to get started.</b></p>
        </ComponentGroup>
      </Status>
    );
}

export function StateStatus({equityIndicator, setEquityIndicator} : {equityIndicator: EquityIndicator, setEquityIndicator: any}) {
  return (
    <Status>
      <ComponentGroup title="Legend">
        <SelectEquityIndicator equityIndicator={equityIndicator} setEquityIndicator={setEquityIndicator}/>
        <StateLegend />
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
