import { World } from "../ecs/index";
import { RenderSystem } from "../systems/RenderSystem";
import { Object3DSystem } from "../systems/Object3DSystem";
import { AssetManager } from "../ecs/assetManager";
import { Asset, Camera, PointLight } from "../ecs/achetypes";
import { AssetSystem } from "../systems/AssetSystem";
import { OrbitControlsSystem } from "../systems/OrbitControlsSystem";
import { LightSystem } from "../systems/LightSystem";
import { Vector3 } from "three";
import { CameraSystem } from "../systems/CameraSystem";

/** Adds a cube. Nothig more to say :) */
export default async () => {
  const assetManager = new AssetManager();

  assetManager
    .addAsset("assets/models/chair.glb", "chair")
    .addAsset("assets/models/branch.glb", "branch");

  // Wait untill all assets are loaded
  await assetManager.load();

  const world = new World(assetManager.assets);

  const cam = Camera(new Vector3(0, 2, 4));
  const chair = Asset("assets/models/chair.glb");
  const branch = Asset("assets/models/branch.glb");
  const light = PointLight(0xffffff, 20, new Vector3(2, 2, 0));

  world.addEntity(cam).addEntity(chair).addEntity(branch).addEntity(light);

  world
    .registerSystem(RenderSystem)
    .registerSystem(Object3DSystem)
    .registerSystem(AssetSystem)
    .registerSystem(CameraSystem)
    .registerSystem(OrbitControlsSystem)
    .registerSystem(LightSystem);

  return world;
};
