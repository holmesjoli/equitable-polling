// Libraries
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Rectangle } from "react-leaflet";

// Components
import * as Tooltip from "./Tooltip";

// Types
import { State, County } from "../utils/Types";

import { defaultState } from "../utils/Global";

// Global
import { layersStyle, centerUS, outerBounds, defaultCounty } from "../utils/Global";

export function mouseOver(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.highlight);
    Tooltip.pointerOver(event.originalEvent.clientX, event.originalEvent.clientY, layer.feature.properties.name);
}

export function mouseOut(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.default.state);
    Tooltip.pointerOut();
}

function LayersComponent({ usData, setFullScreen, selectedState, setSelectedState, selectedCounty, setSelectedCounty }: { usData: GeoJSON.FeatureCollection, setFullScreen: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any }) {
    const map = useMap();

    const countyDataAll = {type: 'FeatureCollection', features: [] as GeoJSON.Feature[]} as GeoJSON.FeatureCollection;
    const tractDataAll = {type: 'FeatureCollection', features: [] as GeoJSON.Feature[]} as GeoJSON.FeatureCollection;

    usData.features.forEach((e: any) => {
        e.properties.counties.features.forEach((d: any) => {
            countyDataAll.features.push(d);
            d.properties.tracts.features.forEach((c: any) => {
                tractDataAll.features.push(c);
            });
        });
    });

    // Functions ---------------------------------------------------

    function onEachState(_: any, layer: any) {
        layer.on({
          mouseover: mouseOver,
          mouseout: mouseOut,
          click: onClickState
        });
    }

    function onClickState(event: any) {
        var layer = event.target;
        setFullScreen(false);
        const clickedState = usData.features.find(d => d.properties!.stfp === layer.feature.properties.stfp)!.properties;
        setSelectedState(clickedState as State);
        setSelectedCounty(defaultCounty);

        map.flyTo(clickedState!.latlng, clickedState!.zoom);
    }

    function onEachCounty(_: any, layer: any) {
        layer.on({
          mouseover: mouseOver,
          mouseout: mouseOut,
          click: onClickCounty
        });
    }

    function onClickCounty(event: any) {
        var layer = event.target;
        const clickedCounty = selectedState.counties.features.find(d => d.properties!.cntyfp === layer.feature.properties.cntyfp)!.properties;
        setSelectedCounty(clickedCounty as County);

        map.flyTo(clickedCounty!.latlng, clickedCounty!.zoom);
    }

    function onEachTract(_: any, layer: any) {
        layer.on({
          mouseover: mouseOver,
          mouseout: mouseOut
        });
    }

    // React Hooks ---------------------------------------------------

    // on Click Rectange - Resets the zoom and full screen to the us map
    const onClickRect = useMemo(
        () => ({
          click() {
            map.flyTo(centerUS, 5);
            setFullScreen(true);
            setSelectedState(defaultState);
          },
        }),
        [map]
    ); 

    useEffect(() => {
        map.flyTo(selectedState.latlng, selectedState.zoom);
    }, [selectedState]);

    useEffect(() => {
        // if else add otherwise react finds the center of the world map in Africa
        if (selectedCounty.stfp !== "") {
            map.flyTo(selectedCounty.latlng, selectedCounty.zoom);
        }
    }, [selectedCounty]);

    return(
        <div className="Layers">
            <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} eventHandlers={onClickRect}/>
            {selectedState.stfp === "" ? 
                <GeoJSON data={usData} style={layersStyle.default.state} onEachFeature={onEachState} /> : 
                <>
                    <GeoJSON data={usData} style={layersStyle.selected.state}/>
                    {/* {selectedCounty.cntyfp === "" ?  */}
                    <GeoJSON data={countyDataAll} style={layersStyle.default.county} onEachFeature={onEachCounty}/>:
                    {/* <>
                        <GeoJSON data={countyDataAll} style={layersStyle.selected.county}/>
                        <GeoJSON data={tractDataAll} style={layersStyle.default.county} onEachFeature={onEachTract}/>
                    </>
                    } */}
                </>
            }
        </div>
    )
}

export default function Map({ usData, setFullScreen, selectedState, setSelectedState, selectedCounty, setSelectedCounty }: { usData: GeoJSON.FeatureCollection, setFullScreen: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any }): JSX.Element {

    return(
        <MapContainer
            className="home-map"
            center={[centerUS.lat, centerUS.lng]}
            zoom={5}
            minZoom={4}
            maxZoom={18}
            scrollWheelZoom={false}
            zoomControl={false}
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <LayersComponent usData={usData} setFullScreen={setFullScreen} selectedState={selectedState} setSelectedState={setSelectedState} selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty}/>
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
