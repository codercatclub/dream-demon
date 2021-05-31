import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Group, LoadingManager } from "three";

export type LoaderResult = Promise<Group>;
export type Loader = (src: string) => LoaderResult;

const fbxLoader = new FBXLoader();
const gltfLoader = new GLTFLoader();

export const loadFBX: Loader = (src): Promise<Group> =>
  new Promise((resolve, reject) => {
    fbxLoader.load(src, resolve, () => {}, reject);
  });

export const loadGLTF: Loader = (src): Promise<Group> =>
  new Promise((resolve, reject) => {
    gltfLoader.load(
      src,
      (gltf) => resolve(gltf.scene),
      () => {},
      reject
    );
  });

const loaders = {
  fbx: loadFBX,
  glb: loadGLTF,
};

export const getLoader = (extension: string): Loader | null => {
  if (!Object.keys(loaders).includes(extension)) {
    console.log(`[-] loading ${extension} is not supported.`);
    return null;
  }

  const type = extension as keyof typeof loaders;

  return loaders[type];
};
