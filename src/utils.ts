import { GUI } from 'dat.gui';
import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { generateUUID } from 'three/src/math/MathUtils';

const gui = new GUI();

async function customGLTFLoader(url: string, nameGuiFolder: string = generateUUID(),
    options: {
        x: number,
        y: number,
        z: number
    } = { x: 0, y: 0, z: 0 }): Promise<Group>{
    return new Promise((resolve, reject) => {
        const glftLoader = new GLTFLoader();
        glftLoader.load(url, (glft) => {
            const model = glft.scene;
            const modelGui = gui.addFolder(nameGuiFolder);
            const modelOption = { 
                wireframe: false,
                x: options.x,
                y: options.y,
                z: options.z
            }
            modelGui.add(modelOption, "x", -1000, 1000).onChange((value: number) => {
                model.position.x = value;
            })
            modelGui.add(modelOption, "y", -1000, 1000).onChange((value: number) => {
                model.position.y = value;
            })
            modelGui.add(modelOption, "z", -1000, 1000).onChange((value: number) => {
                model.position.z = value;
            })
            resolve(model);
        }, undefined, (err) => {
            console.log(err);
        })
    });
}

export { customGLTFLoader }