import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
    CSS2DRenderer,
    CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';
import * as GeometryUtils from 'three/examples/jsm/utils/GeometryUtils.js';
import { mainLight, ambientLight, hemiLight, dirLight } from './components/Lights';
import worldPlane from './components/WorldPlane';
import { gridHelper } from './components/PlaneHelper';


//creating scene
const mainScene = new THREE.Scene()
mainScene.background = new THREE.Color( 0xffffff );

//LIGHTS

// mainScene.add(mainLight);
// mainScene.add(ambientLight);
mainScene.add(hemiLight);
mainScene.add(dirLight);

//CAMERA 
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000)

camera.position.set(8, 6, 8)


//renderer
const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

//renderer for labels
const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth, window.innerHeight)
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0px'
labelRenderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(labelRenderer.domElement)


const pickableObjects: THREE.Mesh[] = []

//adding WORLD PLANE
mainScene.add(worldPlane);
mainScene.add( gridHelper );

//controls of camera
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

//scene geometry
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    wireframe: false,
})

const cube = new THREE.Mesh(geometry, material)
mainScene.add(cube);
cube.receiveShadow = true;
cube.castShadow = true;




pickableObjects.push(worldPlane)


// LINES TEST
let coord = [10,0.1,10,5,0.1,5];

const geomLine = new LineGeometry();
geomLine.setPositions(coord);

const matLine = new LineMaterial({
    color: 10,
    linewidth: 1,
    resolution: new THREE.Vector2(640, 480) // resolution of the viewport
  // dashed, dashScale, dashSize, gapSize

});

const myLine = new Line2(geomLine, matLine);

myLine.computeLineDistances();

mainScene.add(myLine);


//test line


window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    labelRenderer.setSize(window.innerWidth, window.innerHeight)
    render()
}


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
        if (intersects.length > 0) {
            if (!drawingLine) {
                //start the line
                const points = []
                points.push(intersects[0].point)
                points.push(intersects[0].point.clone())
                const geometry = new THREE.BufferGeometry().setFromPoints(
                    points
                )
                line = new THREE.LineSegments(
                    geometry,
                    new THREE.LineBasicMaterial({
                        color: 0x555555,
                        transparent: false,
                        opacity: 0.9,
                        linewidth: 2
                        // depthTest: false,
                        // depthWrite: false
                    })
                )
                line.frustumCulled = false
                mainScene.add(line)

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
            }
        }
    }
}

document.addEventListener('mousemove', onDocumentMouseMove, false)
function onDocumentMouseMove(event: MouseEvent) {
    event.preventDefault()

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    if (drawingLine) {
        raycaster.setFromCamera(mouse, camera)
        intersects = raycaster.intersectObjects(pickableObjects, false)
        if (intersects.length > 0) {
            const positions = line.geometry.attributes.position
                .array as Array<number>
            const v0 = new THREE.Vector3(
                positions[0],
                positions[1],
                positions[2]
            )
            const v1 = new THREE.Vector3(
                intersects[0].point.x,
                intersects[0].point.y,
                intersects[0].point.z
            )
            positions[3] = intersects[0].point.x
            positions[4] = intersects[0].point.y
            positions[5] = intersects[0].point.z
            line.geometry.attributes.position.needsUpdate = true
            const distance = v0.distanceTo(v1)
            measurementLabels[lineId].element.innerText =
                distance.toFixed(2) + 'm'
            measurementLabels[lineId].position.lerpVectors(v0, v1, 0.5)
        }
    }
}

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
