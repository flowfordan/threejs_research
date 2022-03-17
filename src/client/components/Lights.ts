import * as THREE from 'three'

//creating light

//dirLight
export const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( - 1, 1.75, 1 );
dirLight.position.multiplyScalar( 30 );
				

dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;

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

//third
export const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 50, 0 );
