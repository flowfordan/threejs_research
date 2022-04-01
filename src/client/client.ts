import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module';
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
const pointGeometry = new THREE.BufferGeometry()

const vertices = new Float32Array( [5, 5, 5] );
const colors = new Float32Array( [120, 230, 150] );


// itemSize = 3 because there are 3 values (components) per vertex
pointGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
pointGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 4))

const myPoint = new THREE.Points(pointGeometry)

mainScene.add(cube, myLine2, myLine, myPoint);




pickableObjects.push(worldPlane)







//GUI
const gui = new GUI()
const actionsFolder = gui.addFolder('Actions')
let createPointBtn = {Create_Point: function(){console.log('button to create point')}};
actionsFolder.add(createPointBtn, 'Create_Point')
actionsFolder.open()


//STATS
const stats = Stats()
document.body.appendChild(stats.dom)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    labelRenderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()

    stats.update()
}

function render() {
    labelRenderer.render(mainScene, camera)
    renderer.render(mainScene, camera)
}
animate()
