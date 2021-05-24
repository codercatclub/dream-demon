export const PosC = {
  type: "PosC",
  data: {
    x: 0,
    y: 0,
    z: 0,
  },
};

export const NameC = {
  type: "NameC",
  data: {
    name: "Albert",
  },
};

export const RenderC = {
  type: "RenderC",
  data: null,
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
