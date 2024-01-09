// Libraries
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Rectangle, FeatureGroup } from "react-leaflet";

// Components
import * as Tooltip from "./Tooltip";

// Types
import { State, County } from "../utils/Types";

// Global
import { defaultMap, outerBounds, defaultCounty, defaultState } from "../utils/Global";

// Data
import { unnestedTracts, countyData, stateData, updateSelectedCounty } from "../utils/DM";

// Styles 
import { layersStyle, highlightSelectedStyle } from "../utils/Theme";

export function mouseOver(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.highlight);
    Tooltip.pointerOver(event.originalEvent.clientX, event.originalEvent.clientY, layer.feature.properties.name);
}

export function mouseOut(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.default);
    Tooltip.pointerOut();
}

export function mouseOverTract(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.highlightTract);
    Tooltip.pointerOver(event.originalEvent.clientX, event.originalEvent.clientY, layer.feature.properties.name);
}

export function mouseOutTract(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.defaultTract);
    Tooltip.pointerOut();
}

function LayersComponent({ setFullScreen, selectedState, setSelectedState, selectedCounty, setSelectedCounty, showPolls, setShowPolls, showVD, setShowVD }: 
                         { setFullScreen: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any, showPolls: boolean, setShowPolls: any, showVD: boolean, setShowVD: any}) {

    const map = useMap();

    // Functions ---------------------------------------------------

    function onEachState(_: any, layer: any) {
        layer.on({
          mouseover: mouseOver,
          mouseout: mouseOut,
          click: onClickState
        });
        Tooltip.pointerOut();
    }

    function onClickState(event: any) {
        var layer = event.target;
        setFullScreen(false);
        const clickedState = stateData.features.find((d: GeoJSON.Feature) => d.properties!.stfp === layer.feature.properties.stfp)!.properties;
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
        updateSelectedCounty(selectedState, setSelectedState, layer.feature.properties.cntyfp);
        const clickedCounty = selectedState.counties.features.find(d => d.properties!.cntyfp === layer.feature.properties.cntyfp)!.properties;
        setSelectedCounty(clickedCounty as County);
        Tooltip.pointerOut();
        map.flyTo(clickedCounty!.latlng, clickedCounty!.zoom);
    }

    function onEachTract(_: any, layer: any) {
        layer.on({
          mouseover: mouseOverTract,
          mouseout: mouseOutTract
        });
    }

    // React Hooks ---------------------------------------------------

    // on Click Rectangle - Resets the zoom and full screen to the us map
    const onClickRect = useMemo(
        () => ({
          click() {
            map.flyTo(defaultMap.center, defaultMap.zoom);
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
        } else {
            map.flyTo(selectedState.latlng, selectedState.zoom);
        }

        updateSelectedCounty(selectedState, setSelectedState, selectedCounty.cntyfp);

        // Update the color of the county when county is updated
        map.eachLayer((layer) => {
            if ((layer as any).feature) {
                if ((layer as any).feature.properties.selected) {
                    (layer as any).setStyle(highlightSelectedStyle((layer as any).feature));
                }
            }
        });
    }, [selectedCounty, selectedState]);

    return(
        <div className="Layers">
            <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} eventHandlers={onClickRect}/>
            {selectedState.stfp === "" ?
                <GeoJSON data={stateData} style={layersStyle.default} onEachFeature={onEachState} /> : 
                <FeatureGroup>
                    <GeoJSON data={stateData} style={layersStyle.selected}/>
                    {selectedCounty.cntyfp === "" ? 
                        <GeoJSON data={countyData} style={layersStyle.default} onEachFeature={onEachCounty}/>
                    :
                        <FeatureGroup>
                            <GeoJSON data={countyData} style={highlightSelectedStyle}/>
                            <GeoJSON data={unnestedTracts(selectedState)} style={layersStyle.defaultTract} onEachFeature={onEachTract}/>
                        </FeatureGroup>
                    }
                </FeatureGroup>
            }
        </div>
    )
}

export default function Map({ setFullScreen, selectedState, setSelectedState, selectedCounty, setSelectedCounty, showPolls, setShowPolls, showVD, setShowVD }: 
                            { setFullScreen: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any, showPolls: boolean, setShowPolls: any, showVD: boolean, setShowVD: any }): JSX.Element {

    return(
        <MapContainer
            className="home-map"
            center={[defaultMap.center.lat, defaultMap.center.lng]}
            zoom={defaultMap.zoom}
            minZoom={defaultMap.minZoom}
            maxZoom={defaultMap.maxZoom}
            scrollWheelZoom={false}
            zoomControl={false}
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <LayersComponent setFullScreen={setFullScreen} 
                             selectedState={selectedState} setSelectedState={setSelectedState} 
                             selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty}
                             showPolls={showPolls} setShowPolls={setShowPolls}
                            showVD={showVD} setShowVD={setShowVD}
                             />
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
