import { WebGLRenderer, Scene, PerspectiveCamera, AxesHelper,
    GridHelper, DirectionalLight, DirectionalLightHelper, EquirectangularReflectionMapping, sRGBEncoding,
    Group, BoxGeometry, MeshBasicMaterial, Mesh, Material, MeshPhysicalMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GUI } from 'dat.gui';
import { customGLTFLoader } from './utils';
import { World, Vec3, Body, Box, Sphere } from "cannon-es";

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
const directLight = new DirectionalLight();
directLight.position.y = 5;
directLight.position.x = 5;
scene.add(directLight);
const directLightHelper = new DirectionalLightHelper(directLight);
scene.add(directLightHelper);

const gui = new GUI();
const orbitControls = new OrbitControls(camera, renderer.domElement);
const rgbeLoader = new RGBELoader();

renderer.outputEncoding = sRGBEncoding;

const world = new World({
    gravity: new Vec3(0, -9.8, 0)
})
const timeStep = 1/60;

const planeMesh = new BoxGeometry(50, 0.1, 50);
const planeMaterial = new MeshBasicMaterial({ color: "red" });
const plane = new Mesh(planeMesh, planeMaterial);
plane.material.wireframe = false;
scene.add(plane);

const planeBody = new Body({
    shape: new Box(new Vec3(50, 0.1, 50))
});
const carBody = new Body({
    shape: new Sphere(0.01),
    mass: 1,
    position: new Vec3(0, 0.5, 0),
    velocity: new Vec3(0, 0, 5)
});

let carModel: Group;
rgbeLoader.load("/assets/hdr/HDR_029_Sky_Cloudy_Free/grass.hdr",async (texture) => {
    texture.mapping = EquirectangularReflectionMapping;
    scene.background = texture;

    const mapModel = await customGLTFLoader(
        "/assets/abc/scene.gltf",
        "map",
        {
            x: 0,
            y: -109,
            z: 0
        }
    );
    scene.add(mapModel);
    mapModel.position.y = -109;

    carModel = await customGLTFLoader(
        "/assets/untitled.glb",
        "car"
    );
    // carModel.traverse((node) => {
    //     if(node.type === "Mesh"){
    //         ((node as Mesh).material as MeshPhysicalMaterial).wireframe = true;
    //     }
    // })
    scene.add(carModel);

    world.addBody(planeBody);
    world.addBody(carBody);
})

const axesHelper = new AxesHelper(5);
const gridHelper = new GridHelper();
scene.add(axesHelper);
scene.add(gridHelper);
const cameraOption = {
    x: 0,
    y: 5,
    z: 8
}
camera.position.y = 5;
camera.position.z = 8;
orbitControls.update();

const cameraGui = gui.addFolder("camera");
cameraGui.add(cameraOption, "x", 0, 100).onChange((value: number) => {
    camera.position.x = value;
    orbitControls.update();
})
cameraGui.add(cameraOption, "y", 0, 100).onChange((value: number) => {
    camera.position.y = value;
    orbitControls.update();
})
cameraGui.add(cameraOption, "z", -100, 100).onChange((value: number) => {
    camera.position.z = value;
    orbitControls.update();
})

function animate(time: number){
    world.step(timeStep);
    if(typeof carModel !== "undefined"){
        plane.position.copy(planeBody.position as any);
        plane.quaternion.copy(planeBody.quaternion as any);
        carModel.position.copy(carBody.position as any);
        //carModel.quaternion.copy(carBody.quaternion as any);
    }
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

console.log("abc");