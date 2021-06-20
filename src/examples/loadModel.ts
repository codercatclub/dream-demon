import { extend, World } from "../ecs";
import { RenderSystem } from "../systems/RenderSystem";
import { Object3DSystem } from "../systems/Object3DSystem";
import { AssetManager } from "../assetManager";
import { Asset, Camera, PointLight } from "../achetypes";
import { AssetSystem } from "../systems/AssetSystem";
import { OrbitControlsSystem } from "../systems/OrbitControlsSystem";
import { MaterialC } from "../components";
import { LightSystem } from "../systems/LightSystem";
import { Vector3 } from "three";
import { CameraSystem } from "../systems/CameraSystem";

/** Adds a cube. Nothig more to say :) */
export default async () => {
  const assetManager = new AssetManager();

  assetManager.addAsset("assets/models/chair.glb", "chair");

  // Wait untill all assets are loaded
  await assetManager.load();

  const world = new World(assetManager.assets);

  const cam = Camera(new Vector3(0, 2, 4));
  const chair = extend(Asset("assets/models/chair.glb"), [MaterialC]);
  const light = PointLight(0xffffff, 20, new Vector3(2, 2, 0));

  world.addEntity(cam).addEntity(chair).addEntity(light);

  world
    .registerSystem(RenderSystem)
    .registerSystem(Object3DSystem)
    .registerSystem(AssetSystem)
    .registerSystem(CameraSystem)
    .registerSystem(OrbitControlsSystem)
    .registerSystem(LightSystem);

  return world;
};
