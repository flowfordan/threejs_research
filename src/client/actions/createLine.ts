import * as THREE from 'three';
import camera from '../components/Camera';
import mainScene from '../client'
import {renderer} from '../components/Renderers'
import createPoint from './createPoint'


let mouse = new THREE.Vector2()
let raycaster = new THREE.Raycaster();


let LineService = {
    status: 0,
    coords: new THREE.Vector3( ),
}


const createLine = () => {

    console.log('start func')
    createPoint
    //if
    updateLine()
    
    
}


const updateLine = () => {
    console.log('upd START')
    window.addEventListener( 'pointermove', onLineUpd );
    window.addEventListener( 'pointerdown', onLineEnd );

}

const onLineUpd = (event: any) => {
    console.log('line creating')
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
           LineService.coords = intersects[i].point;
        }

        else{renderer.domElement.style.cursor = 'not-allowed'}

    }
	
    if(LineService.status === 1){
        return
    }

}

const onLineEnd = () => {
    renderer.domElement.style.cursor = 'default'
    LineService.status = 1;
    //get coords
    //set point
    console.log('CREATE POINT')
    console.log('POINT COORD', LineService.coords)


    const pointGeometry = new THREE.BufferGeometry()
    const vertices = new Float32Array( [LineService.coords.x, 0, LineService.coords.z] );
    const material = new THREE.PointsMaterial( { color: 0x0066ff, size: 0.5 } );
    material.depthTest = false
    material.depthWrite = false
    pointGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    const myPoint = new THREE.Points(pointGeometry, material)

    mainScene.add(myPoint)

    window.removeEventListener( 'pointermove', onLineUpd );
    window.removeEventListener( 'pointerdown', onLineEnd );
    return
}

export default createLine;