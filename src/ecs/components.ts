import { Vector3, Color, Group, Audio } from "three";

interface Component<T> {
  type: string;
  data: T;
}

export const TransformC = {
  type: "TransformC",
  data: {
    position: new Vector3(),
    rotation: new Vector3(),
    scale: new Vector3(1, 1, 1),
  },
};

export const MovingC = {
  type: "MovingC",
  data: {
    speed: 1.0,
    amplitude: 1.0,
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
    object3d: new Group(),
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
    part: "",
  },
};

export const PointLightC = {
  type: "PointLightC",
  data: {
    color: new Color(0xffffff),
    intensity: 1.0,
    distance: 100,
    showHelper: false,
    shadow: false,
  },
};

export const HemisphereLightC = {
  type: "HemisphereLightC",
  data: {
    skyColor: 0xffffbb,
    groundColor: 0x080820,
    intensity: 2.0,
  },
};

export const MaterialC = {
  type: "MaterialC",
  data: {
    shader: "CCBasic",
    color1: new Color(0xacb6e5),
    color2: new Color(0x74ebd5),
    part: "",
  },
};

export const CCMaterialC = {
  type: "CCMaterialC",
  data: {
    color: new Color(0xffffff),
  },
};

export const VineMaterialC = {
  type: "VineMaterialC",
  data: {},
};

export const VoidMaterialC = {
  type: "VoidMaterialC",
  data: {},
};

export const IntervalSpawnerC = {
  type: "IntervalSpawnerC",
  data: null,
};

export const FlickerC = {
  type: "FlickerC",
  data: {
    speed: 1,
  },
};

export const GLTFCameraC = {
  type: "GLTFCameraC",
  data: null,
};

export const GLTFLigthsC = {
  type: "GLTFLigthsC",
  data: null,
};

export const AnimationC = {
  type: "AnimationC",
  data: {
    clipName: "",
  },
};

export const CharAnimationC = {
  type: "CharAnimationC",
  data: null,
};

export const ScrollAnimationC = {
  type: "ScrollAnimationC",
  data: null,
};

export const ConstraintLookC = {
  type: "ConstraintLookC",
  data: null,
};

export const LinkTransformC = {
  type: "LinkTransformC",
  data: {
    // TODO (Kirill): It is probably better to target component by full path in the scene or relative to specific asset.
    targetName: "",
    linkPos: true,
    linkRot: true,
  },
};

interface AudioCData {
  src: string;
  audio: Audio | null;
  volume: number;
  autoplay: boolean;
  scrollPlayTime: number;
  scrollStopTime: number;
  fadeTime: number;
  loop: boolean;
}

export const AudioC: Component<AudioCData> = {
  type: "AudioC",
  data: {
    src: "",
    volume: 0.5,
    audio: null,
    autoplay: false,
    scrollPlayTime: -1.0,
    scrollStopTime: 100,
    fadeTime: 0.6,
    loop: false
  },
};

export const FirstPersonC: Component<null> = {
  type: "FirstPersonC",
  data: null,
};

