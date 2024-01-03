// Libraries
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Rectangle } from "react-leaflet";

// Components
import * as Tooltip from "./Tooltip";

// Types
import { State, County } from "../utils/Types";

// Global
import { layersStyle, centerUS, outerBounds, defaultCounty, defaultState } from "../utils/Global";

// Data
import { unnestedTractData, unnestedCountyData, nestedStateData } from "../utils/DM";

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

function LayersComponent({ setFullScreen, selectedState, setSelectedState, selectedCounty, setSelectedCounty }: 
                         { setFullScreen: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any}) {

    const map = useMap();

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
        const clickedState = nestedStateData.features.find(d => d.properties!.stfp === layer.feature.properties.stfp)!.properties;
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
        } else {
            map.flyTo(selectedState.latlng, selectedState.zoom);
        }
    }, [selectedCounty]);


    return(
        <div className="Layers">
            <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} eventHandlers={onClickRect}/>
            {selectedState.stfp === "" ?
                <GeoJSON data={nestedStateData} style={layersStyle.default} onEachFeature={onEachState} /> : 
                <>
                    <GeoJSON data={nestedStateData} style={layersStyle.selected}/>
                    {selectedCounty.cntyfp === "" ? 
                        <GeoJSON data={unnestedCountyData} style={layersStyle.default} onEachFeature={onEachCounty}/>
                    :
                        <>
                            <GeoJSON data={unnestedCountyData} style={layersStyle.selected}/>
                            <GeoJSON data={unnestedTractData} style={layersStyle.default} onEachFeature={onEachTract}/>
                        </>
                    }
                </>
            }
        </div>
    )
}

export default function Map({ setFullScreen, selectedState, setSelectedState, selectedCounty, setSelectedCounty }: 
                            { setFullScreen: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any }): JSX.Element {

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
            <LayersComponent setFullScreen={setFullScreen} selectedState={selectedState} setSelectedState={setSelectedState} selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty} />
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
