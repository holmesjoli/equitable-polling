// Libraries
import { useEffect, useMemo, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Rectangle, FeatureGroup } from "react-leaflet";

// Components
import * as Tooltip from "./Tooltip";

// Types
import { State, County, GeoID } from "../utils/Types";

// Global
import { defaultMap, outerBounds, defaultCounty } from "../utils/Global";

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

function LayersComponent({ mapRef, geoJsonId, setGeoJsonId, selectedState, setSelectedState, selectedCounty, setSelectedCounty, showPolls, setShowPolls, showVD, setShowVD }: 
                         { mapRef: any, geoJsonId: GeoID, setGeoJsonId: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any, showPolls: boolean, setShowPolls: any, showVD: boolean, setShowVD: any}) {

    const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection>(stateData);
    const [geoJsonBoundaryData, setGeoJsonBoundaryData] = useState<GeoJSON.FeatureCollection>({} as GeoJSON.FeatureCollection);

    const geoJsonRef = useRef<L.GeoJSON<any, any>>(null);
    const geoJsonBoundaryRef = useRef<L.GeoJSON<any, any>>(null);

    const onDrillDown = (event: any) => {
        const layer = event.target;
        const properties = layer.feature.properties;
        setGeoJsonId({geoid: properties.geoid, name: properties.name, type: properties.type, latlng: properties.latlng, zoom: properties.zoom} as GeoID);

        if (properties.type === "State") {
            setSelectedState(stateData?.features.find(d => d.properties?.geoid === properties.geoid)?.properties as State);
            setSelectedCounty(defaultCounty);

            setGeoJsonBoundaryData(stateData);
            setGeoJsonData(countyData);
        } else if (properties.type === "County") {

            const county = countyData?.features.find(d => d.properties?.geoid === properties.geoid)?.properties as County;
            setSelectedCounty(county);
            setGeoJsonBoundaryData(countyData);

            // const bounds = mapRef.current.getBounds();
            // const ne = bounds.getNorthEast();
            // const sw = bounds.getSouthWest();

            // const tracts = unnestedTracts().features.filter((d: any) => (d.properties.bounds.northEast.lat < ne.lat) && 
            //                                                                        (d.properties.bounds.northEast.lng < ne.lng) &&
            //                                                                        (d.properties.bounds.southWest.lat > sw.lat) &&
            //                                                                        (d.properties.bounds.southWest.lng > sw.lng));

            // console.log(tracts)
            // setGeoJsonData({type: 'FeatureCollection', features: tracts} as GeoJSON.FeatureCollection);
            setGeoJsonData(unnestedTracts(county.stfp));
        }
    }

    useEffect(() => {
        // if (mapRef.current && geoJsonRef.current) {

        //     console.log(mapRef.current.getBounds());
        //     console.log(geoJsonRef.current.getBounds());
    
        //     // mapRef.current.fitBounds(
        //     //     geoJsonRef.current.getBounds()
        //     // );
        // }

        if (geoJsonId.geoid != '0') {
            mapRef.current.flyTo(geoJsonId!.latlng, geoJsonId!.zoom); // zooms to new map location
            geoJsonBoundaryRef.current?.clearLayers().addData(geoJsonBoundaryData);
            geoJsonRef.current?.clearLayers().addData(geoJsonData); // Replaces geojson clickable elements with drilldown
        }

        // console.log(mapRef.current.getBounds());
        // if (geoJsonRef.current) {
        //     console.log(geoJsonRef.current.getBounds());
        // }
    }, [geoJsonId]);


    // Functions ---------------------------------------------------

    function onEachFeature(_: any, layer: any) {
        layer.on({
          mouseover: mouseOver,
          mouseout: mouseOut,
          click: onDrillDown
        });
        Tooltip.pointerOut();
    }

    // function onClickState(event: any) {
    //     var layer = event.target;
    //     const clickedState = stateData.features.find((d: GeoJSON.Feature) => d.properties!.stfp === layer.feature.properties.stfp)!.properties;
    //     setSelectedState(clickedState as State);
    //     setSelectedCounty(defaultCounty);

    //     // map.flyTo(clickedState!.latlng, clickedState!.zoom);
    // }

    // function onEachCounty(_: any, layer: any) {
    //     layer.on({
    //       mouseover: mouseOver,
    //       mouseout: mouseOut,
    //       click: onClickCounty
    //     });
    // }

    // function onClickCounty(event: any) {
    //     var layer = event.target;
    //     updateSelectedCounty(selectedState, setSelectedState, layer.feature.properties.cntyfp);
    //     const clickedCounty = selectedState.counties.features.find(d => d.properties!.cntyfp === layer.feature.properties.cntyfp)!.properties;
    //     setSelectedCounty(clickedCounty as County);
    //     Tooltip.pointerOut();
    //     // map.flyTo(clickedCounty!.latlng, clickedCounty!.zoom);
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
            mapRef.current.flyTo(defaultMap.latlng, defaultMap.zoom);
            setGeoJsonId(defaultMap);
            setGeoJsonData(stateData);
            geoJsonRef.current?.clearLayers().addData(stateData); // Replaces geojson clickable elements with drilldown
          }
        }),
        [geoJsonId]
    );

    // useEffect(() => {

    //     // if else add otherwise react finds the center of the world map in Africa
    //     if (selectedCounty.stfp !== "") {
    //         map.flyTo(selectedCounty.latlng, selectedCounty.zoom);
    //     } else {
    //         map.flyTo(selectedState.latlng, selectedState.zoom);
    //     }

    //     // Update the color of the county when county is updated
    //     map.eachLayer((layer) => {
    //         if ((layer as any).feature) {
    //             if ((layer as any).feature.properties.selected) {
    //                 (layer as any).setStyle(highlightSelectedStyle((layer as any).feature));
    //             }
    //         }
    //     });

    //     setTractsData(unnestedTracts(selectedState));

    //     // console.log(map.getBounds());
    // }, [selectedCounty, selectedState]);

    return(
        <div className="Layers">
            <Rectangle bounds={outerBounds} pathOptions={layersStyle.greyOut} eventHandlers={onClickRect}/>
            <FeatureGroup>
                {geoJsonId.geoid != '0' ? <GeoJSON data={geoJsonBoundaryData} style={layersStyle.outline} ref={geoJsonBoundaryRef} key="geoJsonBoundary"/> : null}
                <GeoJSON data={geoJsonData} style={layersStyle.default} onEachFeature={onEachFeature} ref={geoJsonRef} key="geoJsonAll"/>
            </FeatureGroup>
            {/* {selectedState.stfp === "" ?
                <GeoJSON data={stateData} style={layersStyle.default} onEachFeature={onEachState} /> : 
                <FeatureGroup>
                    <GeoJSON data={stateData} style={layersStyle.selected} />
                    {selectedCounty.cntyfp === "" ? 
                        <GeoJSON data={countyData} style={layersStyle.default} onEachFeature={onEachCounty} />
                    :
                        <FeatureGroup>
                            <GeoJSON data={countyData} style={highlightSelectedStyle}/>
                            <GeoJSON key="tract-geo-layer" ref={geoJsonTractsLayer} data={tractsData} style={layersStyle.defaultTract} onEachFeature={onEachTract}/>
                        </FeatureGroup>
                    }
                </FeatureGroup>
            } */}
        </div>
    )
}

export default function Map({ geoJsonId, setGeoJsonId, selectedState, setSelectedState, selectedCounty, setSelectedCounty, showPolls, setShowPolls, showVD, setShowVD }: 
                            { geoJsonId: GeoID, setGeoJsonId: any, selectedState: State, setSelectedState: any, selectedCounty: County, setSelectedCounty: any, showPolls: boolean, setShowPolls: any, showVD: boolean, setShowVD: any }): JSX.Element {

    const mapRef = useRef(null);

    return(
        <MapContainer
            className="home-map"
            center={[defaultMap.latlng.lat, defaultMap.latlng.lng]}
            zoom={defaultMap.zoom}
            minZoom={defaultMap.minZoom}
            maxZoom={defaultMap.maxZoom}
            scrollWheelZoom={false}
            zoomControl={false}
            ref={mapRef}
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <LayersComponent mapRef={mapRef} 
                            geoJsonId={geoJsonId} setGeoJsonId={setGeoJsonId}
                             selectedState={selectedState} setSelectedState={setSelectedState} 
                             selectedCounty={selectedCounty} setSelectedCounty={setSelectedCounty}
                             showPolls={showPolls} setShowPolls={setShowPolls}
                            showVD={showVD} setShowVD={setShowVD}
                             />
            <ZoomControl position="bottomright" />
        </MapContainer>
    );
}
