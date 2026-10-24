import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

const scene = new THREE.Scene();
const canvas = document.getElementById("baymax");
const balalala = new Audio("audio/balalala.mp3");
const helloBaymax = new Audio("audio/hello-baymax.mp3");
var mouseLocked = false;
var mouseReset = false;

const camera = new THREE.PerspectiveCamera(
  56,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 4.15);
camera.lookAt(0, 1.7, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
  alpha: true,
});
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 2));
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const loader = new GLTFLoader();
const clock = new THREE.Clock();

let gltf = null;
let mixer = null;
let headBone = null;
let initialRotation = null;

loader.setMeshoptDecoder(MeshoptDecoder);
loader.load("./3d/baymax.glb", (result) => {
  gltf = result;
  scene.add(gltf.scene);

  mixer = new THREE.AnimationMixer(gltf.scene);
  gltf.scene.traverse((object) => {
    if (object.isBone && object.name === "Armor_Head") {
      headBone = object;
    }
  });
  if (headBone) {
    initialRotation = headBone.quaternion.clone();
    console.log(initialRotation);
  } else {
    console.error("HEAD BONE GAAYAB");
  }
});

function playAnimation(name, gayab) {
  if (!mixer || !gltf) return;
  const clip = THREE.AnimationClip.findByName(gltf.animations, name);
  mouseLocked = true;
  if (gayab) {
    document.getElementById("muth").style.opacity = "0";
    setTimeout(() => {
      balalala.play();
    }, 2500)
  }
  if (name == "Wave") {
    setTimeout(() => {
      helloBaymax.play();
    }, 1000);
  }
  setTimeout(() => {
    mouseReset = true;
    mixer.stopAllAction();
    mixer.addEventListener("finished", (e) => {
      if (e.action == action) {
        console.log("ho gayi");
        mouseLocked = false;
        mouseReset = false;
        if (muth) document.getElementById("muth").style.opacity = "1";
      }
    });
    const action = mixer.clipAction(clip);
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
  }, 350);
}
window.playAnimation = playAnimation;

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.repeat) return;
  if (!mixer || !gltf) return;
  const clip = THREE.AnimationClip.findByName(gltf.animations, "FistBump");
  mouseLocked = true;
  setTimeout(() => {
    mouseReset = true;
    mixer.stopAllAction();
    mixer.addEventListener("finished", (e) => {
      if (e.action == action) {
        console.log("ho gayi");
        mouseLocked = false;
        mouseReset = false;
      }
    });
    const action = mixer.clipAction(clip);
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
  }, 350);
});

const targetRotation = new THREE.Quaternion();
const offsetRotation = new THREE.Quaternion();

const MAX_YAW = THREE.MathUtils.degToRad(35);
const MAX_PITCH = THREE.MathUtils.degToRad(15);
const SMOOTHING = 0.1;

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = 1 - (event.clientY / window.innerHeight) * 2;
});

function updateHeadLook() {
  if (!headBone || !initialRotation) return;
  const yaw = mouseX * MAX_YAW;
  const pitch = -mouseY * MAX_PITCH;
  const yawRotation = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    yaw
  );
  const pitchRotation = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),
    pitch
  );
  offsetRotation.copy(yawRotation).multiply(pitchRotation);
  targetRotation.copy(initialRotation).multiply(offsetRotation);
  if (mouseLocked) {
    if (!mouseReset) headBone.quaternion.slerp(initialRotation, SMOOTHING);
    return;
  }
  headBone.quaternion.slerp(targetRotation, SMOOTHING);
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) {
    mixer.update(delta);
  }
  updateHeadLook();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});
