import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Group, Texture, TextureLoader } from "three";

export type LoaderResult<T> = Promise<T>;
export type Loader<T> = (src: string) => LoaderResult<T>;

const fbxLoader = new FBXLoader();
const gltfLoader = new GLTFLoader();
const textureLoader = new TextureLoader();

export const loadFBX: Loader<Group> = (src) =>
  new Promise((resolve, reject) => {
    fbxLoader.load(src, resolve, () => {}, reject);
  });

export const loadGLTF: Loader<Group> = (src) =>
  new Promise((resolve, reject) => {
    gltfLoader.load(
      src,
      (gltf) => resolve(gltf.scene),
      () => {},
      reject
    );
  });

export const loadTexture: Loader<Texture> = (src) =>
  new Promise((resolve, reject) => {
    textureLoader.load(
      src,
      resolve,
      () => {},
      reject
    );
  });

export const loaders = {
  fbx: loadFBX,
  glb: loadGLTF,
  jpg: loadTexture
};

export type AssetType = keyof typeof loaders;

export function getLoader(type: AssetType): (Loader<Group | Texture> | null) {
  return loaders[type];
};
