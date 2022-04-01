import * as THREE from 'three'


const pointGeometry = new THREE.BufferGeometry()

const vertices = new Float32Array( [10, 0, 5] );
const material = new THREE.PointsMaterial( { color: 0x0066ff, size: 0.5 } );
material.depthTest = false
material.depthWrite = false

// itemSize = 3 because there are 3 values (components) per vertex
pointGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );


const myPoint = new THREE.Points(pointGeometry, material)

export {myPoint}