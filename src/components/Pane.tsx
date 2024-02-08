// Libraries
import { useRef, useMemo, useEffect } from "react";
import { GeoJSON, Rectangle, FeatureGroup, Circle, Pane } from "react-leaflet";
import { select } from 'd3';

import { GeoID } from "../utils/Types";

import { defaultMap, outerBounds } from "../utils/Global";

// Styles
import { layersStyle, theme } from "../utils/Theme";

export function BackgroundPane({geoJsonId, setGeoJsonId} : {geoJsonId: GeoID, setGeoJsonId: any}) {

    const rectRef = useRef<L.Rectangle>(null);

    // on Click Rectangle - Resets the zoom and full screen to the us map
    const onClickRect = useMemo(
        () => ({
            click() {
            setGeoJsonId({geoid: defaultMap.geoid, type: defaultMap.type} as GeoID);
            }
        }),
        [geoJsonId]
    );


    return(
        <Pane name="background-pane" style={{ zIndex: -100 }}>
            <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} eventHandlers={onClickRect} ref={rectRef}/>
        </Pane>
    )

}
