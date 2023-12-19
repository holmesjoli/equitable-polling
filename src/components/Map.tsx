import { style } from '../utils/Global';

export function mouseOver(event: any) {
    var layer = event.target;
    layer.setStyle({
        color: "#047391",
        fillOpacity: 0.7
    });
}

export function mouseOut(event: any) {
    var layer = event.target;
    layer.setStyle(style);
}