import { World, newEntity } from "../ecs";
import { TransformC, GeometryC, Object3DC } from "../components";
import { RenderSystem } from "../systems/RenderSystem";
import { BasicPrimitivesSystem } from "../systems/BasicPrimitivesSystem";
import { Object3DSystem } from "../systems/Object3DSystem";

/** Adds a cube. Nothig more to say :) */
export default () => {
  const world = new World();

  const box = newEntity([TransformC, GeometryC, Object3DC]);
  
  world.addEntity(box);
  
  world
    .registerSystem(RenderSystem)
    .registerSystem(Object3DSystem)
    .registerSystem(BasicPrimitivesSystem);
  
  return world;
};
