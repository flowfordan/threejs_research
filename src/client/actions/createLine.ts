import * as THREE from 'three';
import camera from '../components/Camera';
import mainScene from '../client'
import {renderer} from '../components/Renderers'
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';
import { basicLineSolid, basicLineDashed } from './../materials/lines/LinesMaterial';
import { basicPointMat } from '../materials/points/PointsMaterial';


let mouse = new THREE.Vector2()
let raycaster = new THREE.Raycaster();
const gZero = 0.15 //Z(vertical) level for lines & points

interface LineData {
    status: number,
    coordsPoint: Float32Array,
    coordsLine: Float32Array,
}

let LineService: LineData = {
    //0-started func, 1- created first point, 2 - created second point
    status: 0, 
    coordsPoint: new Float32Array(3),
    coordsLine: new Float32Array([0, gZero,0, 0, gZero,0]),
}

//line to draw
const geomLine = new LineGeometry();
geomLine.setPositions(LineService.coordsLine);
const custLine = new Line2(geomLine, basicLineDashed);


const createLine = (): void => {
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
                renderer.domElement.style.cursor = 'crosshair';
                LineService.coordsPoint = Float32Array.from([
                    intersects[i].point.x, 
                    gZero, 
                    intersects[i].point.z])
            }
            else{renderer.domElement.style.cursor = 'not-allowed'}
        }
    }

    
    if(LineService.status === 1){
        for (let i = 0; i < intersects.length; i++){
            if(intersects[i].object.name === 'ground'){
                renderer.domElement.style.cursor = 'crosshair'

                LineService.coordsPoint = Float32Array.from([
                    intersects[i].point.x, 
                    gZero, 
                    intersects[i].point.z])

                LineService.coordsLine[3] = LineService.coordsPoint[0]
                LineService.coordsLine[5] = LineService.coordsPoint[2]

                geomLine.setPositions(LineService.coordsLine);
                
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
        const pointGeometry = new THREE.BufferGeometry();
        const vertices = LineService.coordsPoint;
        console.log('CREATE POINT 1', LineService.coordsPoint)
        pointGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        const myPoint = new THREE.Points(pointGeometry, basicPointMat);
        mainScene.add(myPoint);

        //add line change init 000-000 to 111-111
        //[coordsPoint, coordPoint]
        LineService.coordsLine = Float32Array.from([
            ...LineService.coordsPoint,
            ...LineService.coordsPoint
        ])

        geomLine.setPositions(LineService.coordsLine);

        console.log('coordLINE', LineService.coordsLine)
        return
    } 
    

    if(LineService.status === 1){
        //create 2 point and exit
        //second point
        const pointGeometry = new THREE.BufferGeometry()
        const vertices = Float32Array.from(LineService.coordsPoint)
        console.log(LineService.coordsPoint)

        pointGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        const myPoint = new THREE.Points(pointGeometry, basicPointMat)
        mainScene.add(myPoint)


        //delete helping line
        mainScene.remove(custLine)

        //add final line
        const geomLine = new LineGeometry();
        geomLine.setPositions(LineService.coordsLine)
        const finLine = new Line2(geomLine, basicLineSolid);
        mainScene.add(finLine)
        

        console.log('exit')
        LineService.status = 0;
        LineService.coordsLine = new Float32Array([0, gZero,0, 0, gZero,0]),
        LineService.coordsPoint = new Float32Array(3)
        window.removeEventListener( 'pointermove', onMouseMove );
        window.removeEventListener( 'pointerdown', onMouseDown );
        renderer.domElement.style.cursor = 'default'
        console.log(LineService)
        console.log(mainScene)
        return
    } 
    
}


export default createLine;