import { World, newEntity } from "../ecs/index";
import { TransformC, GeometryC, Object3DC } from "../ecs/components";
import { RenderSystem } from "../systems/RenderSystem";
import { BasicPrimitivesSystem } from "../systems/BasicPrimitivesSystem";
import { Object3DSystem } from "../systems/Object3DSystem";
import { PointLightSystem } from "../systems/PointLightSystem";

/** Adds a cube. Nothig more to say :) */
export default async () => {
  const world = new World();

  const box = newEntity([TransformC, GeometryC, Object3DC]);
  
  world.addEntity(box);
  
  world
    .registerSystem(RenderSystem) // Render system should be always first
    .registerSystem(Object3DSystem)
    .registerSystem(BasicPrimitivesSystem)
    .registerSystem(PointLightSystem);
  
  return world;
};
