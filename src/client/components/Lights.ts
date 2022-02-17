import * as THREE from 'three'

//creating light
// first one
export const mainLight = new THREE.SpotLight()
mainLight.position.set(-12.5, 12.5, -12.5)
mainLight.castShadow = true
mainLight.shadow.mapSize.width = 4096
mainLight.shadow.mapSize.height = 4096
mainLight.shadow.radius = 1;
mainLight.intensity = 0.8;


//second one
export const ambientLight = new THREE.AmbientLight()
ambientLight.intensity = 0.3;
