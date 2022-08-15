import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import 'normalize.css'

import { makeRunner } from "./story"

const overlay = document.querySelector('#overlay')
const textBox = document.querySelector('#text-box')

fetch('data/story.yarn')
.then(response => response.text())
.then(data => {
  makeRunner(textBox, overlay, data)
})

const modelLoader = new GLTFLoader()
modelLoader.setPath('models/')

const CANVAS_WIDTH = window.innerWidth
const CANVAS_HEIGHT = window.innerHeight

const canvas = document.getElementById('canvas')
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT)

const scene = new THREE.Scene()

let camera = new THREE.Camera()

const ambientLight = new THREE.AmbientLight(new THREE.Color(0xffffff), 0.3)
scene.add(ambientLight)

modelLoader.load('office.glb', gltf => {
  gltf.scene.traverse(child => {
    if (child.isMesh) {
      child.receiveShadow = true
      child.castShadow = true
    } else if (child.isPointLight) {
      child.castShadow = true
      child.shadow.camera.near = 0.1
      child.shadow.camera.far = 100
      child.shadow.camera.left = -50
      child.shadow.camera.right = 50
      child.intensity /= 100
      child.needsUpdate = true
    } else if(child.isCamera) {
      child.fov = 60
      child.aspect = CANVAS_WIDTH / CANVAS_HEIGHT
      camera = child
    }
  })

  scene.add(gltf.scene)
})

function render() {
  requestAnimationFrame(render)
  
  renderer.render(scene, camera)
}

render()

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onResize)

