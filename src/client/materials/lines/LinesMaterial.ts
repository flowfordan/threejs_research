import * as THREE from 'three';
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';



export const basicLineDashed = new LineMaterial({
    color: 0x676767,
    linewidth: 0.8,
    resolution: new THREE.Vector2(640, 480),
    dashed: true,
    dashScale: 2,
    dashSize: 2,
    gapSize: 1

});

export const basicLineSolid = new LineMaterial({
    color: 10,
    linewidth: 0.8,
    resolution: new THREE.Vector2(640, 480),
    dashed: false,
    dashScale: 2,
    dashSize: 2,
    gapSize: 1
});