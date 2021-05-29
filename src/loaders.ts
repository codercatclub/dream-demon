import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export const loadGLTF = (src: string): Promise<GLTF> =>
  new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      src,
      resolve,
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      reject
    );
  });