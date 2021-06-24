import { extend, World } from "../ecs/index";
import { StandardPrimitive } from "../ecs/achetypes";
import { RenderSystem } from "../systems/RenderSystem";
import { BasicPrimitivesSystem } from "../systems/BasicPrimitivesSystem";
import { Object3DSystem } from "../systems/Object3DSystem";
import { OrbitControlsSystem } from "../systems/OrbitControlsSystem";
import { IntervalSpawnerC } from "../ecs/components";
import { IntervalSpawnSystem } from "../systems/IntervalSpawnSystem";

/** This example demonstrate how to add entities at runtime */
export default async () => {
  const world = new World();

  const cube = StandardPrimitive("Sphere");

  const cubeSpawner = extend(cube, [IntervalSpawnerC]);

  world.addEntity(cubeSpawner);

  world
    .registerSystem(RenderSystem)
    .registerSystem(Object3DSystem)
    .registerSystem(OrbitControlsSystem)
    .registerSystem(BasicPrimitivesSystem)
    .registerSystem(IntervalSpawnSystem)

  return world;
};
