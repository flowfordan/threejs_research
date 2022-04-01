import * as THREE from 'three';
import { GUI } from 'dat.gui';

const gui = new GUI()
const actionsFolder = gui.addFolder('Actions')


let createPointBtn = {createPont: function(){console.log('button to create point')}};

actionsFolder.add(createPointBtn, 'Create Point')
actionsFolder.open()

export default gui