import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { WebGLRenderer, Scene, PerspectiveCamera, AxesHelper,
    BoxGeometry, MeshBasicMaterial, Mesh, GridHelper } from 'three';


const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new Scene();
const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
const orbitControls = new OrbitControls(camera, renderer.domElement);

const axesHelper = new AxesHelper(5);
const gridHelper = new GridHelper();
scene.add(axesHelper);
scene.add(gridHelper);
camera.position.z = 10;
camera.position.x = 2;
camera.position.y = 4;
orbitControls.update();

const boxGeometry = new BoxGeometry();
const boxMaterial = new MeshBasicMaterial({ color: "red" })
const box = new Mesh(boxGeometry, boxMaterial);

scene.add(box);

function animate(time: number){
    box.rotation.y = time / 1000;
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

console.log("abc");