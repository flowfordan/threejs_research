import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    2000)

camera.position.set(30, 30, 30)

export default camera