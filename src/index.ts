import { Object3DSystem } from "./systems/Object3DSystem";
import { MoveSystem } from "./systems/MoveSystem";
import { StatsSystem } from "./systems/StatsSystem";
import { RenderSystem } from "./systems/RenderSystem";
import { CameraSystem } from "./systems/CameraSystem";
import { OrbitControlsSystem } from "./systems/OrbitControlsSystem";
import { BasicPrimitivesSystem } from "./systems/BasicPrimitivesSystem";
import { AssetSystem } from "./systems/AssetSystem";
import { LightSystem } from "./systems/LightSystem";
import { newEntity, World, extend } from "./ecs";
import { Asset, Camera } from "./achetypes";
import { Vector3 } from "three";
import {
  Object3DC,
  PointLightC,
  TransformC,
  MaterialC,
} from "./components";
import { MaterialSystem } from "./systems/MaterialSystem";
import { AssetManager } from "./assetManager";

(async () => {
  const assetManager = new AssetManager();

  assetManager
    .addAsset("assets/models/girlinchar.glb", "girlinchar")
    .addAsset("assets/models/branch.glb", "branch")
    .addAsset("assets/models/ground_patch.fbx", "ground_patch")
    .addAsset("assets/textures/env.jpg", "env_texture");

  // Wait untill all assets are loaded
  await assetManager.load();

  const world = new World(assetManager.assets);

  const girlinchar = extend(Asset("assets/models/girlinchar.glb"), [
    { ...MaterialC, data: { ...MaterialC.data, shader:"Vine"} },
    {
      ...TransformC,
      data: { ...TransformC.data, scale: new Vector3(0.2, 0.2, 0.2), position: new Vector3(0, 0, 1) },
    }
  ]);



  [
    Camera(new Vector3(0, 0, 4)),
    girlinchar,
  ].forEach((ent) => {
    world.addEntity(ent);
  });

  const light1 = newEntity([
    {
      ...PointLightC,
      data: { ...PointLightC.data, color: 0xffffff, intensity: 4 },
    },
    Object3DC,
    {
      ...TransformC,
      data: { ...TransformC.data, position: new Vector3(0, 2, 2) },
    },
    // { ...MovingC, data: { speed: 0.5, amplitude: 3.0 } },
  ]);

  world
    .addEntity(Asset("assets/models/ground_patch.fbx", new Vector3(0, 0, 0)))
    .addEntity(light1);

  world
    .registerSystem(CameraSystem)
    .registerSystem(RenderSystem)
    .registerSystem(Object3DSystem)
    .registerSystem(BasicPrimitivesSystem)
    .registerSystem(MoveSystem)
    .registerSystem(AssetSystem)
    .registerSystem(StatsSystem)
    .registerSystem(LightSystem)
    .registerSystem(OrbitControlsSystem)
    .registerSystem(MaterialSystem);

  console.log("[D] world: ", world);

  // // Serialization test
  // world.entities.forEach((ent) => {
  //   console.log(
  //     JSON.stringify(
  //       { ...ent, components: Array.from(ent.components.entries()) },
  //       null,
  //       2
  //     )
  //   );
  // });

  world.init();
})();
