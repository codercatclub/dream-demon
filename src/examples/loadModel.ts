import { extend, World } from "../ecs/index";
import { RenderSystem } from "../systems/RenderSystem";
import { Object3DSystem } from "../systems/Object3DSystem";
import { AssetManager } from "../ecs/assetManager";
import { Asset, Camera, HemisphereLight, PointLight } from "../ecs/achetypes";
import { AssetSystem } from "../systems/AssetSystem";
import { OrbitControlsSystem } from "../systems/OrbitControlsSystem";
import { PointLightSystem } from "../systems/PointLightSystem";
import { Vector3, Color } from "three";
import { CameraSystem } from "../systems/CameraSystem";
import { MaterialC } from "../ecs/components";
import { MaterialSystem } from "../systems/MaterialSystem";
import { StatsSystem } from "../systems/StatsSystem";
import { HemisphereLightSystem } from "../systems/HemisphereLightSystem";

/** Adds a cube. Nothig more to say :) */
export default async () => {
  const assetManager = new AssetManager();

  const ENV_GLTF = "assets/models/env_ktx.glb";

  assetManager
    .addAsset(ENV_GLTF, "env")
    .addAsset("assets/models/chair.glb", "chair")
    .addAsset("assets/models/branch.glb", "branch")
    .addAsset("assets/models/girlinchair.glb", "girlinchair")
    .addAsset("assets/textures/env.jpg", "env_tex"); // Environmental texture for PBR material.

  // Wait untill all assets are loaded
  await assetManager.load();

  const world = new World(assetManager.assets);

  const cam = Camera(new Vector3(0, 2, 4));

  const env = Asset({ src: ENV_GLTF });
  const chair = Asset({ src: "assets/models/chair.glb" });

  const girl = Asset({
    src: "assets/models/girlinchair.glb",
    scale: new Vector3(0.18, 0.18, 0.18),
    position: new Vector3(0, 0, 0.9),
    part: "/Root/BODY",
  });

  const wires = extend(
    Asset({
      src: "assets/models/girlinchair.glb",
      scale: new Vector3(0.18, 0.18, 0.18),
      position: new Vector3(0, 0, 0.9),
      part: "/Root/WIRES",
    }),
    [MaterialC]
  );

  const light1 = PointLight({
    intensity: 20,
    position: new Vector3(2, 2, 2.8),
    color: new Color(1, 0.6, 0.6),
    showHelper: true,
    shadow: true,
  });

  const light2 = PointLight({
    intensity: 7,
    position: new Vector3(-2, 2, 2.8),
    color: new Color(0.7, 0.7, 1),
    showHelper: true,
    shadow: true,
  });

  const hLight = HemisphereLight({ intensity: 0.5 });

  world
    .addEntity(cam)
    .addEntity(env)
    .addEntity(chair)
    .addEntity(girl)
    .addEntity(light1)
    .addEntity(light2)
    .addEntity(wires)
    .addEntity(hLight);

  world
    .registerSystem(RenderSystem.configure({ enableShadows: true }))
    .registerSystem(Object3DSystem)
    .registerSystem(AssetSystem)
    .registerSystem(CameraSystem)
    .registerSystem(OrbitControlsSystem)
    .registerSystem(HemisphereLightSystem)
    .registerSystem(PointLightSystem)
    .registerSystem(MaterialSystem)
    .registerSystem(StatsSystem);

  return world;
};
