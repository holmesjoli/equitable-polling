// Libraries
import { useEffect, useMemo, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Rectangle, FeatureGroup } from "react-leaflet";

// Components
import * as Tooltip from "./Tooltip";

// Types
import { State, County } from "../utils/Types";

// Global
import { defaultMap, outerBounds, defaultCounty, defaultState } from "../utils/Global";

// Data
import { unnestedTracts, countyData, stateData } from "../utils/DM";

// Styles 
import { layersStyle, highlightSelectedStyle } from "../utils/Theme";

export function mouseOut(event: any) {
    var layer = event.target;
    layer.setStyle(layersStyle.default);
    Tooltip.pointerOut();
}

// export function mouseOutTract(event: any) {
//     var layer = event.target;
//     layer.setStyle(layersStyle.defaultTract);
//     Tooltip.pointerOut();
// }

function LayersComponent({ setFullScreen, selectedState, setSelectedState, selectedCounty, setSelectedCounty, showPolls, setShowPolls, showVD, setShowVD }: 
                         { setFullScreen: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any, showPolls: boolean, setShowPolls: any, showVD: boolean, setShowVD: any}) {

    const map = useMap();

    // const [countyLayerData, setCountyLayerData] = useState<GeoJSON.FeatureCollection>(countyData);
    const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection>(stateData);
    const [geoJsonBoundaryData, setGeoJsonBoundaryData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);

    const geoJsonRef = useRef<L.GeoJSON<any, any>>(null);
    const geoJsonBoundaryRef = useRef<L.GeoJSON<any, any>>(null);

    // Functions ---------------------------------------------------

    // function mouseOverTract(event: any) {
    //     var layer = event.target;
    //     layer.setStyle(layersStyle.highlightTract);
    //     var coords = map.latLngToContainerPoint(layer.feature.properties.latlng);
    //     Tooltip.pointerOver(coords.x, coords.y, `<span class="Bold">${layer.feature.properties.descr}: <span>${layer.feature.properties.name}</span>`);
    // }

    function mouseOver(event: any) {
        var layer = event.target;
        layer.setStyle(layersStyle.highlight);
        var coords = map.latLngToContainerPoint(layer.feature.properties.latlng);
        Tooltip.pointerOver(coords.x, coords.y, `<span class="Bold">${layer.feature.properties.name} ${layer.feature.properties.descr}</span>`);
    }

    function onEachFeature(_: any, layer: any) {
        layer.on({
          mouseover: mouseOver,
          mouseout: mouseOut,
          click: onClickFeature
        });
        Tooltip.pointerOut();
    }

    function onClickFeature(event: any) {
        var layer = event.target;
        const properties = layer.feature.properties;

        if (properties.type === "State") {
            setSelectedState(stateData?.features.find(d => d.properties?.geoid === properties.geoid)?.properties as State);
            setSelectedCounty(defaultCounty);

            setGeoJsonBoundaryData(stateData);
            setGeoJsonData(countyData);
        } else if (properties.type === "County") {
            const county = countyData?.features.find(d => d.properties?.geoid === properties.geoid)?.properties as County;
            setSelectedCounty(county);
            setGeoJsonBoundaryData(countyData);

            // const bounds = mapRef?.current?.getBounds();
            // const ne = bounds?.getNorthEast();
            // const sw = bounds?.getSouthWest();

            const tracts = unnestedTracts(county.stfp);
            // .features.filter((d: any) => (d.properties.bounds.northEast.lat < ne!.lat) && 
            //                                                             (d.properties.bounds.northEast.lng < ne!.lng) &&
            //                                                             (d.properties.bounds.southWest.lat > sw!.lat) &&
            //                                                             (d.properties.bounds.southWest.lng > sw!.lng));

            // console.log(tracts);

            setGeoJsonData(tracts);
        }
        // setFullScreen(false);
        // const clickedState = stateData.features.find((d: GeoJSON.Feature) => d.properties!.stfp === layer.feature.properties.stfp)!.properties;
        // setSelectedState(clickedState as State);
        // setSelectedCounty(defaultCounty);

        // map.flyTo(clickedState!.latlng, clickedState!.zoom);
    }

    // function onEachCounty(_: any, layer: any) {
    //     layer.on({
    //       mouseover: mouseOver,
    //       mouseout: mouseOut,
    //       click: onClickCounty
    //     });
    // }

    // function onClickCounty(event: any) {
    //     var layer = event.target;
    //     const clickedCounty = selectedState.counties.features.find(d => d.properties!.cntyfp === layer.feature.properties.cntyfp)!.properties;
    //     setSelectedCounty(clickedCounty as County);
    //     Tooltip.pointerOut();
    //     map.flyTo(clickedCounty!.latlng, clickedCounty!.zoom);
    // }

    // function onEachTract(_: any, layer: any) {
    //     layer.on({
    //       mouseover: mouseOverTract,
    //       mouseout: mouseOutTract
    //     });
    // }

    // React Hooks ---------------------------------------------------

    // on Click Rectangle - Resets the zoom and full screen to the us map
    const onClickRect = useMemo(
        () => ({
          click() {
            map.flyTo(defaultMap.latlng, defaultMap.zoom);
            setFullScreen(true);
            setSelectedState(defaultState);
          },
        }),
        [map]
    );

    useEffect(() => {

        // if else add otherwise react finds the center of the world map in Africa
        if (selectedState.stfp === '' && selectedCounty.cntyfp === '') {
            map.flyTo(defaultMap.latlng, defaultMap.zoom); // zooms to country level
        } else {
            setFullScreen(false);
            if (selectedCounty.stfp !== '') {                
                map.flyTo(selectedCounty.latlng, selectedCounty.zoom); // zooms to county level
            } else {
                map.flyTo(selectedState.latlng, selectedState.zoom); // zooms to state level 
            }    
        }
        
        // Update in boundary and interactive layer
        geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData);
        geoJsonRef.current?.clearLayers().addData(geoJsonData); // Replaces geojson clickable elements with drilldown
    }, [selectedState, selectedCounty]);

    // useEffect(() => {
    //     // Update the color of the county when county is updated
    //     if (selectedCounty.cntyfp !== "") {

    //         countyData.features.forEach((d: GeoJSON.Feature) => {
    //             if (d.properties!.geoid === selectedCounty.geoid) {
    //                 d.properties!.selected = true;
    //             } else {
    //                 d.properties!.selected = false;
    //             }
    //         });

    //         map.eachLayer((layer) => {
    //             if ((layer as any).feature) {
    //                 if ((layer as any).feature.properties.type === "County") {
    //                     (layer as any).setStyle(highlightSelectedStyle((layer as any).feature));
    //                 }
    //             }
    //         });
    //     }

    // }, [selectedCounty, selectedState]);

    return(
        <div className="Layers">
            <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} eventHandlers={onClickRect}/>
            <FeatureGroup>
                {selectedState.stfp !== '' ? <GeoJSON data={geoJsonBoundaryData} style={layersStyle.outline} ref={geoJsonBoundaryRef} key="geoJsonBoundary"/> : null}
                <GeoJSON data={geoJsonData} style={layersStyle.default} onEachFeature={onEachFeature} ref={geoJsonRef} key="geoJsonAll"/>
            </FeatureGroup>
        </div>
    )
}

export default function Map({ setFullScreen, selectedState, setSelectedState, selectedCounty, setSelectedCounty, showPolls, setShowPolls, showVD, setShowVD }: 
                            { setFullScreen: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any, showPolls: boolean, setShowPolls: any, showVD: boolean, setShowVD: any }): JSX.Element {

    return(
        <MapContainer
            className="home-map"
            center={[defaultMap.latlng.lat, defaultMap.latlng.lng]}
            zoom={defaultMap.zoom}
            minZoom={4}
            maxZoom={18}
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
