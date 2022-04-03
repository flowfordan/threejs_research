import * as THREE from 'three';
import camera from '../components/Camera';
import mainScene from '../client'
import {renderer} from '../components/Renderers'


let mouse = new THREE.Vector2()
let raycaster = new THREE.Raycaster();


let PointService = {
    status: 0,
    coords: new THREE.Vector3( ),
}


const createPoint = () => {
    console.log('start func')
    window.addEventListener( 'pointermove', onMouseMove );
    window.addEventListener( 'pointerdown', onMouseDown );
    
}


const onMouseMove = (event: any) => {

    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    

    // calculate objects intersecting the picking ray
    
    const intersects = raycaster.intersectObjects( mainScene.children );

    for (let i = 0; i < intersects.length; i++){
        if(intersects[i].object.name === 'ground'){
            renderer.domElement.style.cursor = 'crosshair'
           console.log('GROUND coord', intersects[i].point)
           PointService.coords = intersects[i].point;
        }

        else{renderer.domElement.style.cursor = 'not-allowed'}

    }
	
    if(PointService.status === 1){
        return
    }

}

const onMouseDown = () => {
    renderer.domElement.style.cursor = 'default'
    PointService.status = 1;
    //get coords
    //set point
    console.log('CREATE POINT')
    console.log('POINT COORD', PointService.coords)


    const pointGeometry = new THREE.BufferGeometry()
    const vertices = new Float32Array( [PointService.coords.x, 0, PointService.coords.z] );
    const material = new THREE.PointsMaterial( { color: 0x0066ff, size: 0.5 } );
    material.depthTest = false
    material.depthWrite = false
    pointGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    const myPoint = new THREE.Points(pointGeometry, material)

    mainScene.add(myPoint)
    PointService.status = 0;
    window.removeEventListener( 'pointermove', onMouseMove );
    window.removeEventListener( 'pointerdown', onMouseDown );
    return
}

export default createPoint;
