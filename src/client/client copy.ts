import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
    CSS2DRenderer,
    CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer';
import Stats from 'three/examples/jsm/libs/stats.module';
import * as GeometryUtils from 'three/examples/jsm/utils/GeometryUtils.js';
import * as Lights from './components/Lights';
import worldPlane from './components/WorldPlane';
import { gridHelper } from './components/PlaneHelper';
import camera from './components/Camera';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import {renderer, labelRenderer} from './components/Renderers';
import { cube, myLine, myLine2 } from './components/Geometry';


//creating scene
const mainScene = new THREE.Scene()
mainScene.background = new THREE.Color( 0xffffff );

//LIGHTS
mainScene.add(Lights.hemiLight);
mainScene.add(Lights.dirLight);
mainScene.add(Lights.dirLightHelper)

//renderers
document.body.appendChild(renderer.domElement)
document.body.appendChild(labelRenderer.domElement)

const pickableObjects: THREE.Mesh[] = []

//adding WORLD PLANE
mainScene.add(worldPlane);
mainScene.add( gridHelper );

//controls of camera
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

//scene geometry
mainScene.add(cube, myLine2, myLine);

pickableObjects.push(worldPlane)



window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    labelRenderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

//args for drawing
let ctrlDown = false
let lineId = 0
let line: THREE.Line
let drawingLine = false
const measurementLabels: { [key: number]: CSS2DObject } = {}

window.addEventListener('keydown', function (event) {
    if (event.key === 'Control') {
        ctrlDown = true
        controls.enabled = false
        renderer.domElement.style.cursor = 'crosshair'
    }
})

window.addEventListener('keyup', function (event) {
    if (event.key === 'Control') {
        ctrlDown = false
        controls.enabled = true
        renderer.domElement.style.cursor = 'pointer'
        if (drawingLine) {
            //delete the last line because it wasn't committed
            mainScene.remove(line)
            mainScene.remove(measurementLabels[lineId])
            drawingLine = false
        }
    }
})


const raycaster = new THREE.Raycaster()
let intersects: THREE.Intersection[]
const mouse = new THREE.Vector2()

renderer.domElement.addEventListener('pointerdown', onClick, false)
function onClick() {
    if (ctrlDown) {
        raycaster.setFromCamera(mouse, camera)
        intersects = raycaster.intersectObjects(pickableObjects, false)

        console.log('1-INTERSECT',intersects)

        if (intersects.length > 0) {
            if (!drawingLine) {
                //start the line
                const points = Array()
                points.push(intersects[0].point)
                points.push(intersects[0].point.clone()) //add second Obj to array, copy of first
                console.log('POINTS',points) //[{},{}]
                
                // const finPoints = Array()
                // const pointObject = Array()
                // let pointsArray = Array()

                // for(let i = 0; i < points.length; i++ ){
                //     console.log('inside FOR',Object.values(points[i]))
                //     pointObject.push(Object.values(points[i]))
                // }
                
                // pointsArray = Array.prototype.concat.apply([], pointObject); //[0 - 5]
                // console.log('POINT ARRAY',pointsArray)

                const geometry = new THREE.BufferGeometry().setFromPoints(
                    points
                )

                // const geometry = new LineGeometry();
                // geometry.setPositions([10, 23, 24, 44, 44, 44])
                console.log('1-GEOMETRY last',geometry)

                line = new THREE.LineSegments(
                    geometry,
                    new THREE.LineBasicMaterial({
                        color: 0x555555,
                        transparent: false,
                        opacity: 0.9,
                        linewidth: 2
                    })
                )

                

                // line = new Line2(geometry, matLine)

                line.frustumCulled = false
                mainScene.add(line)
                console.log('1-LINE self',line)

                const measurementDiv = document.createElement(
                    'div'
                ) as HTMLDivElement
                measurementDiv.className = 'measurementLabel'
                measurementDiv.innerText = '0.0m'
                const measurementLabel = new CSS2DObject(measurementDiv)
                measurementLabel.position.copy(intersects[0].point)
                measurementLabels[lineId] = measurementLabel
                mainScene.add(measurementLabels[lineId])
                drawingLine = true
            } else {
                //finish the line
                const positions = line.geometry.attributes.position
                    .array as Array<number>
                positions[3] = intersects[0].point.x
                positions[4] = intersects[0].point.y
                positions[5] = intersects[0].point.z
                line.geometry.attributes.position.needsUpdate = true
                lineId++
                drawingLine = false
                console.log('INTERSECTS',intersects)
            }
        }
    }
}



document.addEventListener('mousemove', onDocumentMouseMove, false)
function onDocumentMouseMove(event: MouseEvent) {
    event.preventDefault()

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera)
    
    //updating line position while drawing
    if (drawingLine) {
        raycaster.setFromCamera(mouse, camera)
        intersects = raycaster.intersectObjects(pickableObjects, false)

        if (intersects.length > 0) {
            console.log('2-INTERSECTS', intersects)
            console.log('2-LINE self', line)
            // const positions = line.geometry.attributes.position
            //     .array as Array<number>
                const positions = line.geometry.attributes.position
                .array as Array<number>
            console.log('2-update.POSITION', positions)

            //measure
            //1 point of line
            const v0 = new THREE.Vector3(
                positions[0],
                positions[1],
                positions[2]
            )

            //2 point of line
            const v1 = new THREE.Vector3(
                intersects[0].point.x,
                intersects[0].point.y,
                intersects[0].point.z
            )

            positions[3] = intersects[0].point.x
            positions[4] = intersects[0].point.y
            positions[5] = intersects[0].point.z

            console.log('2-update.POSITION - 2', positions)
            line.geometry.attributes.position.needsUpdate = true

            //measure distance
            const distance = v0.distanceTo(v1)
            measurementLabels[lineId].element.innerText =
                distance.toFixed(2) + 'm'
            measurementLabels[lineId].position.lerpVectors(v0, v1, 0.5)
        }
    }
}

//GUI
const gui = new GUI()
const actionsFolder = gui.addFolder('Actions')

let createPointBtn = {Create_Point: function(){console.log('button to create point')}};
actionsFolder.add(createPointBtn, 'Create_Point')
actionsFolder.open()


//STATS
const stats = Stats()
document.body.appendChild(stats.dom)


function animate() {
    requestAnimationFrame(animate)

    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01

    controls.update()

    render()

    stats.update()
}

function render() {
    labelRenderer.render(mainScene, camera)
    renderer.render(mainScene, camera)
}
animate()
