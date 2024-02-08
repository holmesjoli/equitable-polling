import * as d3 from 'd3';

// Styles
import { layersStyle, theme } from "../utils/Theme";

const selector = "root";

// Reusable function to initialize svg
export function init() {
    d3.select(`#${selector}`)
      .append('svg')
      .attr('class', 'Annotation')
      .attr('width', '100%')
      .attr('height', '100%');
}


// export function init() {

//     const data = [{x: 100, y: 200, text: "Test", id: 1}]

//     // useEffect(() => {
//         // initSVG(annotationId);

//         const svg = d3.select(`#${selector} svg`);

//         svg
//         .selectAll('text')
//         .data(data, (d: any) => d.id)
//         .join(
//           (enter: any) => enter
//             .append('text')
//             .attr('x', (d: any) => d.x)
//             .attr('y', (d: any) => d.y)
//             .text((d: any) => d.text)
//             .attr('font-size', 16)
//             .attr('fill', 'black')
//             // ,
//         //   (update: any) => update
//         //     .attr('opacity', (d: any) => 1)
//         );


//         // d3.select()
//     //   }, []);

//     // return(
//     //     // <Pane name="annotation-pane" style={{ zIndex: 200 }}>
//     //         <div id={annotationId}></div>
//     //     // </Pane>
//     // )
// }