// Data Management Step
import statesGeo from "../data/stateGeoJSON.json";
import stateCounty from "../data/stateCounty.json";

export function formattedGeoJSON() {

    const features = [] as GeoJSON.Feature[];

    statesGeo.forEach((d: any) => {
        features.push({type: 'Feature', 
                       properties: {stname: d.stname, 
                                    stfp: d.stfp, 
                                    centroid: {lat: d.Y, long: d.X}, 
                                    counties: stateCounty.find((e: any) => e.stfp === d.stfp)!.counties}, 
                       geometry: d.geometry})
    });

    const data = {type: 'FeatureCollection', features: features} as GeoJSON.FeatureCollection;

    return data;
}