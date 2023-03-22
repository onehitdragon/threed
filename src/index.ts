import { WebGLRenderer, Scene, PerspectiveCamera, AxesHelper,
    BoxGeometry, MeshBasicMaterial, Mesh, GridHelper, DirectionalLight, DirectionalLightHelper, EquirectangularReflectionMapping, sRGBEncoding, Group } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GUI } from 'dat.gui';

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

const orbitControls = new OrbitControls(camera, renderer.domElement);
const glftLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

renderer.outputEncoding = sRGBEncoding;

let carModel: Group;
rgbeLoader.load("/assets/hdr/HDR_029_Sky_Cloudy_Free/grass.hdr", (texture) => {
    texture.mapping = EquirectangularReflectionMapping;
    scene.background = texture;

    glftLoader.load("/assets/untitled.glb", (glft) => {
        carModel = glft.scene;
        scene.add(carModel);
    }, undefined, (err) => {
        console.log(err);
    })
})

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
const boxOption = { 
    color: "#eb4034",
    wireframe: false,
    x: 0,
    y: 0,
    z: 0
}

const gui = new GUI();
const boxGui = gui.addFolder("box-1");
boxGui.addColor(boxOption, "color").onChange((value: string) => {
    box.material.color.set(value);
});
boxGui.add(boxOption, "wireframe").onChange((value: boolean) => {
    box.material.wireframe = value;
})
boxGui.add(boxOption, "x").onChange((value: number) => {
    box.position.x = value;
})
boxGui.add(boxOption, "y").onChange((value: number) => {
    box.position.y = value;
})
boxGui.add(boxOption, "z").onChange((value: number) => {
    box.position.z = value;
})

scene.add(box);

function animate(time: number){
    console.log("aaa");
    if(typeof carModel !== "undefined"){
        carModel.rotation.y = time / 1000;
    }
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

console.log("abc");