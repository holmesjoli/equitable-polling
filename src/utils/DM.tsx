// Data Management Step
import states from "../data/states.json";

export function formattedGeoJSON() {

    const features = [] as GeoJSON.Feature[];

    states.forEach((d: any) => {
        features.push({type: 'Feature', 
                    properties: {name: d.name, stfp: d.stfp, centroid: {lat: d.Y, long: d.X}}, 
                    geometry: d.geometry})
    });

    const data = {type: 'FeatureCollection', features: features} as GeoJSON.FeatureCollection;

    return data;
}