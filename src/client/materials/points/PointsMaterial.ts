import * as THREE from 'three';

export const basicPointMat = new THREE.PointsMaterial( { color: 0x0066ff, size: 0.5 } );
basicPointMat.depthTest = false;
basicPointMat.depthWrite = false;