import { Object3DSystem } from "../systems/Object3DSystem";
import { RenderSystem } from "../systems/RenderSystem";
import { CameraSystem } from "../systems/CameraSystem";
import { Camera, StandardPrimitive } from "../ecs/achetypes";
import { BasicPrimitivesSystem } from "../systems/BasicPrimitivesSystem";
import { World } from "../ecs/index";
import { Vector3 } from "three";
import { IntervalSpawnSystem } from "../systems/IntervalSpawnSystem";

/** Programaticaly and many entities to the scene */
export default async () => {
  const world = new World();

  const cam = Camera(new Vector3(0, 2, 5));

  world.addEntity(cam);

  for (let i = 0; i < 50; i++) {
    const type = i % 2 === 0 ? "Box" : "Sphere";

    const prim = StandardPrimitive(
      type,
      new Vector3(Math.cos(i / 10 - 1.3), i / 10, Math.sin(i / 5))
    );

    world.addEntity(prim);
  }

  world
  .registerSystem(RenderSystem)
  .registerSystem(Object3DSystem)
  .registerSystem(BasicPrimitivesSystem)
  .registerSystem(IntervalSpawnSystem)
  .registerSystem(CameraSystem)

  return world;
};
