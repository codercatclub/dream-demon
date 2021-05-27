export const TransformC = {
  type: "TransformC",
  data: {
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    scale: {
      x: 1,
      y: 1,
      z: 1,
    }
  },
};

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
    far: 10,
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
    uri: "assets/moder.chair.glb",
  },
};
