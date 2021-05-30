import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Group } from "three";

export type LoaderType = "fbx" | "glb";

export type Loader = (src: string) => Promise<Group>;

export type Loaders = {
  [key in LoaderType]: Loader;
};

export const loadFBX = (src: string): Promise<Group> =>
  new Promise((resolve, reject) => {
    const loader = new FBXLoader();
    loader.load(
      src,
      resolve,
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      reject
    );
  });

export const loadGLTF = (src: string): Promise<Group> =>
  new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      src,
      (gltf) => resolve(gltf.scene),
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      reject
    );
  });

export const loaders: Loaders = {
  fbx: loadFBX,
  glb: loadGLTF,
};
