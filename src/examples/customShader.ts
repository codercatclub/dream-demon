import { World, newEntity, newComponent } from "../ecs/index";
import { TransformC, GeometryC, Object3DC, MaterialC } from "../ecs/components";
import { RenderSystem } from "../systems/RenderSystem";
import { BasicPrimitivesSystem } from "../systems/BasicPrimitivesSystem";
import { Object3DSystem } from "../systems/Object3DSystem";
import { MaterialSystem } from "../systems/MaterialSystem";
import { OrbitControlsSystem } from "../systems/OrbitControlsSystem";

/** Adds a cube. Nothig more to say :) */
export default async () => {
  const world = new World();

  // Make custom material component that use TestFrag and TestVert shaders.
  const MyMateriaC = newComponent(MaterialC, { shader: "Test"});

  const box = newEntity([TransformC, GeometryC, Object3DC, MyMateriaC]);

  world.addEntity(box);

  world
    .registerSystem(RenderSystem)
    .registerSystem(Object3DSystem)
    .registerSystem(BasicPrimitivesSystem)
    .registerSystem(OrbitControlsSystem)
    .registerSystem(MaterialSystem);

  return world;
};
