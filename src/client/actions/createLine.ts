import * as THREE from 'three';
import camera from '../components/Camera';
import mainScene from '../client'
import {renderer} from '../components/Renderers'
import createPoint from './createPoint';
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';

let mouse = new THREE.Vector2()
let raycaster = new THREE.Raycaster();

//line to draw
let coords: Array<number> = [0,0,0, 0,0,0]
const geomLine = new LineGeometry();
geomLine.setPositions(coords);
const matLine = new LineMaterial({
    color: 0xff22ff,
    linewidth: 5,
    resolution: new THREE.Vector2(640, 480),
    dashed: true,
    dashScale: 2,
    dashSize: 2,
    gapSize: 1

});

const matLineSolid = new LineMaterial({
    color: 10,
    linewidth: 2,
    resolution: new THREE.Vector2(640, 480),
    dashed: false,
    dashScale: 2,
    dashSize: 2,
    gapSize: 1
});

const custLine = new Line2(geomLine, matLine);

interface LineData {
    status: number,
    coordsPoint: Float32Array,
    coordsNum: Array<number>
}

let LineService: LineData = {
    status: 0, //0-not started, 1- created 1 point, 2 - created 2 point
    coordsPoint: new Float32Array(3),
    coordsNum: new Array()

}


const createLine = () => {
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

    if(LineService.status === 0){
        for (let i = 0; i < intersects.length; i++){
            if(intersects[i].object.name === 'ground'){
                renderer.domElement.style.cursor = 'crosshair'
            //console.log('GROUND coord 1', intersects[i].point)
            //conver vector 3 to coord x y z
                LineService.coordsNum = [intersects[i].point.x, 0, intersects[i].point.z]

                LineService.coordsPoint[0] = intersects[i].point.x
                LineService.coordsPoint[1] = 0
                LineService.coordsPoint[2] = intersects[i].point.z
                
            }
            else{renderer.domElement.style.cursor = 'not-allowed'}
        }
    }

    
	
    if(LineService.status === 1){
        for (let i = 0; i < intersects.length; i++){
            if(intersects[i].object.name === 'ground'){
                renderer.domElement.style.cursor = 'crosshair'
                //console.log('GROUND coord 2', intersects[i].point)
                //conver vector 3 to coord x y z
                LineService.coordsNum = [intersects[i].point.x, 0, intersects[i].point.z]

                LineService.coordsPoint[0] = intersects[i].point.x
                LineService.coordsPoint[1] = 0
                LineService.coordsPoint[2] = intersects[i].point.z

                coords[3] = LineService.coordsNum[0]
                coords[5] = LineService.coordsNum[2]
                geomLine.setPositions(coords);
                
                mainScene.add(custLine)

                custLine.computeLineDistances();
                return

            }
            else{renderer.domElement.style.cursor = 'not-allowed'}
        }
    } 
}


const onMouseDown = () => {
    
    if(LineService.status === 0){
    
        
        LineService.status = 1;
        
        //create point
        const pointGeometry = new THREE.BufferGeometry()
        const vertices = new Float32Array( LineService.coordsPoint );
        console.log('CREATE POINT 1', LineService.coordsPoint)
        const material = new THREE.PointsMaterial( { color: 0x0066ff, size: 0.5 } );
        material.depthTest = false
        material.depthWrite = false
        pointGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        const myPoint = new THREE.Points(pointGeometry, material)
        mainScene.add(myPoint)

        
        //add line
        // let start: Array<number> = [0, 0, 0];
        coords[0] = LineService.coordsNum[0]
        coords[2] = LineService.coordsNum[2]
        coords[3] = LineService.coordsNum[0]
        coords[5] = LineService.coordsNum[2]
        geomLine.setPositions(coords);
        return

    } 
    

    if(LineService.status === 1){
        //create 2 point and exit
        //second point
        const pointGeometry = new THREE.BufferGeometry()
        const vertices = new Float32Array( 
            [LineService.coordsPoint[0], 
            LineService.coordsPoint[1], 
            LineService.coordsPoint[2]] );
        console.log(LineService.coordsPoint)
        const material = new THREE.PointsMaterial( { color: 0x0066ff, size: 0.5 } );
        material.depthTest = false
        material.depthWrite = false
        pointGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        const myPoint = new THREE.Points(pointGeometry, material)
        mainScene.add(myPoint)


        

        //let coords: Array<number> = [...LineService.coordsPoint]

        const geomLine = new LineGeometry();
        geomLine.setPositions(coords)
        
        const custLine = new Line2(geomLine, matLineSolid);
        mainScene.add(custLine)
        

        console.log('exit')
        LineService.status = 0;
        coords = [0,0,0,0,0,0,]
        LineService.coordsPoint = new Float32Array()
        LineService.coordsNum = new Array
        window.removeEventListener( 'pointermove', onMouseMove );
        window.removeEventListener( 'pointerdown', onMouseDown );
        renderer.domElement.style.cursor = 'default'
        console.log(LineService)
        return
    } 
    
}

   

export default createLine;