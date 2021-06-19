import { extend, World } from "../ecs";
import { StandardPrimitive } from "../achetypes";
import { RenderSystem } from "../systems/RenderSystem";
import { BasicPrimitivesSystem } from "../systems/BasicPrimitivesSystem";
import { Object3DSystem } from "../systems/Object3DSystem";
import { OrbitControlsSystem } from "../systems/OrbitControlsSystem";
import { IntervalSpawnerC } from "../components";
import { IntervalSpawnSystem } from "../systems/IntervalSpawnSystem";

/** This example demonstrate how to add entities at runtime */
export default () => {
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
