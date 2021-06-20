import { World } from "../ecs/index";
import { RenderSystem } from "../systems/RenderSystem";
import { Object3DSystem } from "../systems/Object3DSystem";
import { AssetManager } from "../ecs/assetManager";
import { Asset, Camera, HemisphereLight, PointLight } from "../ecs/achetypes";
import { AssetSystem } from "../systems/AssetSystem";
import { OrbitControlsSystem } from "../systems/OrbitControlsSystem";
import { PointLightSystem } from "../systems/PointLightSystem";
import { Vector3 } from "three";
import { CameraSystem } from "../systems/CameraSystem";
import { HemisphereLightSystem } from "../systems/HemisphereLightSystem";

/** Adds a cube. Nothig more to say :) */
export default async () => {
  const assetManager = new AssetManager();

  assetManager
    .addAsset("assets/models/chair.glb", "chair")
    .addAsset("assets/models/branch.glb", "branch")
    .addAsset("assets/textures/env.jpg", "env_tex"); // Environmental texture for PBR material.

  // Wait untill all assets are loaded
  await assetManager.load();

  const world = new World(assetManager.assets);

  const cam = Camera(new Vector3(0, 2, 4));

  const chair = Asset("assets/models/chair.glb");
  const branch = Asset("assets/models/branch.glb");

  const light = PointLight(0xffffff, 2, new Vector3(2, 2, 0));
  const skyLight = HemisphereLight({ position: new Vector3(2, 2, 0) });

  world
    .addEntity(cam)
    .addEntity(chair)
    .addEntity(branch)
    .addEntity(light)
    .addEntity(skyLight);

  world
    .registerSystem(RenderSystem)
    .registerSystem(Object3DSystem)
    .registerSystem(AssetSystem)
    .registerSystem(CameraSystem)
    .registerSystem(OrbitControlsSystem)
    .registerSystem(PointLightSystem)
    .registerSystem(HemisphereLightSystem);

  return world;
};
