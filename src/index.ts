import { extend, World, newComponent } from "./ecs/index";
import { RenderSystem } from "./systems/RenderSystem";
import { Object3DSystem } from "./systems/Object3DSystem";
import { AssetManager } from "./ecs/assetManager";
import { Asset, Camera } from "./ecs/achetypes";
import { AssetSystem } from "./systems/AssetSystem";
import { PointLightSystem } from "./systems/PointLightSystem";
import { Vector3, Color } from "three";
import { CameraSystem } from "./systems/CameraSystem";
import {
  FlickerC,
  MaterialC,
  CCMaterialC,
  VineMaterialC,
  VoidMaterialC,
  GLTFCameraC,
  GLTFLigthsC,
  AnimationC,
  ScrollAnimationC,
  ConstraintLookC,
} from "./ecs/components";
import { MaterialSystem } from "./systems/MaterialSystem";
import { StatsSystem } from "./systems/StatsSystem";
import { HemisphereLightSystem } from "./systems/HemisphereLightSystem";
import { FlickerSystem } from "./systems/FlickerSystem";
import { CCMaterialSystem } from "./systems/CCMaterialSystem";
import { VineMaterialSystem } from "./systems/VineMaterialSystem";
import { VoidMaterialSystem } from "./systems/VoidMaterialSystem";
import { GLTFCameraSystem } from "./systems/GLTFCameraSystem";
import { GLTFLightsSystem } from "./systems/GLTFLightsSystem";
import { AnimationSystem } from "./systems/AnimationSystem";
import { ScrollAnimationSystem } from "./systems/ScrollAnimationSystem";
import { ConstraintLookSystem } from "./systems/ConstrainLookSystem";

(async () => {
  const assetManager = new AssetManager();

  const ENV_GLTF = "assets/models/env_ktx.glb";

  assetManager
    .addAsset(ENV_GLTF, "env")
    .addAsset("assets/models/char_01.glb", "char")
    .addAsset("assets/models/girlinchair.glb", "char")
    .addAsset("assets/models/wires.glb", "wires")
    .addAsset("assets/models/chair.glb", "chair")
    .addAsset("assets/models/branch.glb", "branch")
    .addAsset("assets/models/lights.glb", "lights")
    .addAsset("assets/models/cameras.glb", "cameras")
    .addAsset("assets/models/girlinchair.glb", "girlinchair")
    .addAsset("assets/timeline.json", "timeline_data")
    .addAsset("assets/textures/env.jpg", "env_tex"); // Environmental texture for PBR material.

  // Wait untill all assets are loaded
  await assetManager.load();

  const world = new World(assetManager.loadedAssets);

  const cam = Camera(new Vector3(0, 2, 4));

  const char = extend(
    Asset({
      src: "assets/models/char_01.glb",
    }),
    [AnimationC, newComponent(VoidMaterialC, {})]
  );

  const env = extend(
    Asset({
      src: ENV_GLTF,
    }),
    [newComponent(CCMaterialC, {})]
  );

  const chair = extend(
    Asset({
      src: "assets/models/chair.glb",
    }),
    [newComponent(CCMaterialC, {})]
  );

  const girl = extend(
    Asset({
      src: "assets/models/girlinchair.glb",
      scale: new Vector3(0.18, 0.18, 0.18),
      position: new Vector3(0, 0, 0.9),
      part: "/Root/BODY",
    }),
    [newComponent(VoidMaterialC, {})]
  );

  const wires = extend(
    Asset({
      src: "assets/models/wires.glb",
      scale: new Vector3(0.18, 0.18, 0.18),
      position: new Vector3(0, 0, 0.9),
      part: "/Root/WIRES",
    }),
    [newComponent(VineMaterialC, {})]
  );

  const cameras = extend(
    Asset({
      src: "assets/models/cameras.glb",
    }),
    [GLTFCameraC, ConstraintLookC, ScrollAnimationC]
  );

  const lights = extend(
    Asset({
      src: "assets/models/lights.glb",
    }),
    [GLTFLigthsC, FlickerC]
  );

  world
    .addEntity(cam)
    .addEntity(env)
    .addEntity(chair)
    .addEntity(wires)
    .addEntity(cameras)
    .addEntity(lights)
    .addEntity(girl);

  world
    .registerSystem(
      RenderSystem.configure({
        enableShadows: false,
        fog: { enabled: true, color: new Color(0xc2d1d1), density: 0.03 },
      })
    )
    .registerSystem(Object3DSystem)
    .registerSystem(AssetSystem)
    .registerSystem(CameraSystem)
    // .registerSystem(OrbitControlsSystem)
    .registerSystem(HemisphereLightSystem)
    .registerSystem(PointLightSystem)
    .registerSystem(MaterialSystem)
    .registerSystem(CCMaterialSystem)
    .registerSystem(VineMaterialSystem)
    .registerSystem(VoidMaterialSystem)
    // .registerSystem(StatsSystem)
    .registerSystem(GLTFCameraSystem)
    .registerSystem(GLTFLightsSystem)
    .registerSystem(FlickerSystem)
    .registerSystem(AnimationSystem)
    .registerSystem(ScrollAnimationSystem)
    .registerSystem(ConstraintLookSystem);

  world.init();
})();
