// Libraries
import Draggable from 'react-draggable';

// Components
import { PageDescription, ComponentGroup } from "./Query";

import { StateLegend } from "./Legend";

export function USStatus() {
    return (
      <Status>
        <PageDescription>
            <p>The goal of the Polling Equity Dashboard is to help users assess which communities could
                benefit from additional access to polling locations. The dashboard was designed by 
                the <a href="https://www.newdata.org/" target="_blank">Center for New Data</a>, a 
                non-partisan non-profit interested in using data to strengthen our democracy. <b>Select 
                a <span className="focus">highlighted</span> state to get started.</b></p>
        </PageDescription>
      </Status>
    );
}

export function StateStatus() {
  return (
    <Status>
      <ComponentGroup title="Legend">
        <StateLegend />
      </ComponentGroup>
    </Status>
  );
}

export default function Status ({children}: {children: any}) {

    return (
      <Draggable bounds="body">
        <div className="Status">
            {children}
        </div>
      </Draggable>
    );
}
