import {
  TransformC,
  Object3DC,
  GLTFModelC,
  CamC,
  GeometryC,
} from "./components";
import { newEntity, Entity } from "./ecs";
import { Vector3 } from "three";

export const Asset = (
  src: string,
  position = new Vector3(),
  rotation = new Vector3(),
  scale = new Vector3(1, 1, 1),
): Entity =>
  newEntity([
    { ...GLTFModelC, data: { src } },
    { ...TransformC, data: { position, rotation, scale } },
    Object3DC,
  ]);

export const Camera = (
  position = new Vector3(0, 0, 0),
  rotation = new Vector3(0, 0, 0),
  fov: number = 70,
  aspect: number = window.innerWidth / window.innerHeight,
  near: number = 0.01,
  far: number = 1000
) =>
  newEntity(
    [
      {
        ...TransformC,
        data: {
          ...TransformC.data,
          position,
          rotation,
          fov,
          aspect,
          near,
          far,
        },
      },
      CamC,
    ],
    "Camera"
  );

export type GeometryType = "Box" | "Sphere";

export const StandardPrimitive = (
  type: GeometryType,
  position = new Vector3(0, 0, 0),
  rotation = new Vector3(0, 0, 0),
  scale = new Vector3(1, 1, 1)
) =>
  newEntity([
    {
      ...TransformC,
      data: {
        ...TransformC.data,
        position,
        rotation,
        scale,
      },
    },
    { ...GeometryC, data: { type } },
    Object3DC,
  ]);