import * as d3 from 'd3';

export const thresholdScale = d3.scaleThreshold([-1, .15, .3, .45], ['#C6C6C6', '#2a8ca7', '#67a3b7', '#95bac8', '#c0d2d9']);