import { Vector3, Color } from "three";

export const TransformC = {
  type: "TransformC",
  data: {
    position: new Vector3(),
    rotation: new Vector3(),
    scale: new Vector3(1, 1, 1)
  },
};

export const MovingC = {
  type: "MovingC",
  data: {
    speed: 1.0,
    amplitude: 1.0
  }
}

export const NameC = {
  type: "NameC",
  data: {
    name: "Albert",
  },
};

export const Object3DC = {
  type: "Object3DC",
  data: {
    id: "",
  },
};

export const CamC = {
  type: "CamC",
  data: {
    fov: 70,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.01,
    far: 1000,
  },
};

export const GeometryC = {
  type: "GeometryC",
  data: {
    type: "Box",
  },
};

export const GLTFModelC = {
  type: "GLTFModelC",
  data: {
    src: "assets/models/chair.glb",
  },
};

export const PointLightC = {
  type: "PointLightC",
  data: {
    color: 0xffffff,
    intensity: 1.0,
    distance: 100,
  },
};

export const MaterialC = {
  type: "MaterialC",
  data: {
    shader: 'CCBasic',
    color1: new Color(0xacb6e5),
    color2: new Color(0x74ebd5)
  },
};
