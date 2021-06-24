import { Object3DSystem } from "../systems/Object3DSystem";
import { RenderSystem } from "../systems/RenderSystem";
import { CameraSystem } from "../systems/CameraSystem";
import { Camera, StandardPrimitive } from "../ecs/achetypes";
import { BasicPrimitivesSystem } from "../systems/BasicPrimitivesSystem";
import { World } from "../ecs/index";
import { Vector3 } from "three";

/** This example shows how to remove entities at runtime */
export default async () => {
  const world = new World();
  
  const cam = Camera(new Vector3(0, 2, 4));

  world.addEntity(cam);

  const idToRemove: number[] = [];

  for (let i = 0; i < 100; i++) {
    const type = i % 2 === 0 ? "Box" : "Sphere";

    const prim = StandardPrimitive(
      type,
      new Vector3(Math.cos(i / 5), i / 25, Math.sin(i / 5))
    );

    // Mark every second object for deletion
    if (i % 2 === 0) {
      idToRemove.push(prim.id);
    }

    world.addEntity(prim);
  }

  world
  .registerSystem(RenderSystem)
  .registerSystem(Object3DSystem)
  .registerSystem(BasicPrimitivesSystem)
  .registerSystem(CameraSystem)

  // Remover entities after 3 second
  // NOTE: It is better to remove entities withing a dedicated system.
  // setTimeout is only used for demo purposes and is not desired in final product.
  setTimeout(() => {
    idToRemove.forEach((id) => {
      world.removeEntity(id);
    });
  }, 3000);

  return world;
};
