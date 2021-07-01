import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { Group, Texture, TextureLoader, WebGLRenderer } from "three";

export type LoaderResult<T> = Promise<T>;
export type Loader<T> = (src: string) => LoaderResult<T>;

const fbxLoader = new FBXLoader();
const gltfLoader = new GLTFLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
gltfLoader.setDRACOLoader(dracoLoader);

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath('assets/libs/basis/');

// HACK (Kirill): This is pretty dumb but I have to do it ot init KTX2 settings.
const renderer = new WebGLRenderer();
ktx2Loader.detectSupport( renderer );

gltfLoader.setKTX2Loader(ktx2Loader)

const textureLoader = new TextureLoader();

export const loadFBX: Loader<Group> = (src) =>
  new Promise((resolve, reject) => {
    fbxLoader.load(src, resolve, () => {}, reject);
  });

export const loadGLTF: Loader<GLTF> = (src) =>
  new Promise((resolve, reject) => {
    gltfLoader.load(
      src,
      (gltf) => resolve(gltf),
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

/** Get coresponding loader for a type. Type is come from file extension */
export function getLoader(type: AssetType): (Loader<Group | Texture | GLTF>) {
  return loaders[type];
};
