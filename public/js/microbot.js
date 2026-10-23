import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

const scene = new THREE.Scene();
const canvas = document.getElementById("microbot");

const camera = new THREE.PerspectiveCamera(
  56,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 4.15);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
  alpha: true,
});
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2));
const directionalLight = new THREE.DirectionalLight(0xffffff, 12);
directionalLight.position.set(4, 4, 4);
scene.add(directionalLight);

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
let gltf = null;

loader.load("./3d/microbot.glb", (result) => {
  gltf = result;
  scene.add(gltf.scene);
});

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});

window.addEventListener("mousemove", (e) => {
  if (!gltf) return;
  const mouseX = -(e.clientX / window.innerWidth) * 2 - 1;
  const mouseY = (e.clientY / window.innerHeight) * 2 + 1;
  gltf.scene.rotation.y = mouseX * (Math.PI / 2);
  gltf.scene.rotation.x = mouseY * (Math.PI / 2);
})
