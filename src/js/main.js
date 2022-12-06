import * as THREE from "three";
import { Vector2 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { generateUUID } from "three/src/math/MathUtils";
import "../public/style.css";
import { addLights, updateSun } from "./lighting";

import { createFireFly, updateFirefly } from "./particles";
import { terrainParams, updateTerrain } from "./terrain";
import { makeGUI, makeStats, stats } from "./ui";

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

const loader = new THREE.TextureLoader();
const alpha = loader.load("/public/alpha3.png");

var scene = new THREE.Scene();
scene.background = new THREE.Color().setHSL(0.3, 0, 0.8);
// scene.fog = new THREE.Fog(scene.background, 1, 5000);

var camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 3000);
var cameraTarget = { x: 0, y: 0, z: 0 };
camera.position.y = 70;
camera.position.z = 1000;
camera.rotation.x = (-15 * Math.PI) / 180;

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0xffffff, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

addLights(scene, camera);

var geometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);
var material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  side: THREE.Side,
  alphaMap: alpha,
  transparent: true,
});
var terrain = new THREE.Mesh(geometry, material);
if (terrainParams.FLAT_SHADING) {
  terrain.geometry = terrain.geometry.toNonIndexed();
}
terrain.rotation.x = -Math.PI / 2;
scene.add(terrain);

var firefly = createFireFly(scene);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

var clock = new THREE.Clock();

const SPEED = 100;
var i = 0;
function update() {
  var delta = clock.getDelta();
  var elapsed = clock.elapsedTime;
  // terrain.position.z += SPEED * delta;
  // camera.position.z += SPEED * delta;
  /* Moving the terrain forward. */
  updateSun();
  updateFirefly(firefly, elapsed);
  updateTerrain(terrain);
  i++;
}

function render() {
  controls.update();
  renderer.render(scene, camera);
}

function loop() {
  stats.begin();
  update();
  render();
  stats.end();
  requestAnimationFrame(loop);
}
makeStats();
makeGUI();
loop();
