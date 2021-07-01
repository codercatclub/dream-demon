import { extend, World, newComponent } from "./ecs/index";
import { RenderSystem } from "./systems/RenderSystem";
import { Object3DSystem } from "./systems/Object3DSystem";
import { AssetManager } from "./ecs/assetManager";
import { Asset, Camera, HemisphereLight, PointLight } from "./ecs/achetypes";
import { AssetSystem } from "./systems/AssetSystem";
import { OrbitControlsSystem } from "./systems/OrbitControlsSystem";
import { PointLightSystem } from "./systems/PointLightSystem";
import { Vector3, Color } from "three";
import { CameraSystem } from "./systems/CameraSystem";
import { FlickerC, MaterialC, CCMaterialC } from "./ecs/components";
import { MaterialSystem } from "./systems/MaterialSystem";
import { StatsSystem } from "./systems/StatsSystem";
import { HemisphereLightSystem } from "./systems/HemisphereLightSystem";
import { FlickerSystem } from "./systems/FlickerSystem";
import { CCMaterialSystem } from "./systems/CCMaterialSystem";

/** Adds a cube. Nothig more to say :) */
(async () => {
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
    [newComponent(MaterialC, { shader: "Void" })]
  );

  const wires = extend(
    Asset({
      src: "assets/models/girlinchair.glb",
      scale: new Vector3(0.18, 0.18, 0.18),
      position: new Vector3(0, 0, 0.9),
      part: "/Root/WIRES",
    }),
    [newComponent(MaterialC, { shader: "Vine" })]
  );

  const light1 = extend(PointLight({
    intensity: 1,
    position: new Vector3(2, 0.6, 1),
    color: new Color(1, 0.6, 0.6),
    showHelper: false,
    shadow: true,
  }), [FlickerC]);

  const light2 = extend(PointLight({
    intensity: 1,
    position: new Vector3(-2.2, 0.6, 1.5),

    color: new Color(1, 0.6, 0.6),
    showHelper: false,
    shadow: true,
  }), [FlickerC]);

  const hLight = HemisphereLight({ intensity: 0.5 });

  world
    .addEntity(cam)
    .addEntity(env)
    .addEntity(chair)
    .addEntity(girl)
    .addEntity(light1)
    .addEntity(light2)
    .addEntity(wires);
  // .addEntity(hLight);

  world
    .registerSystem(
      RenderSystem.configure({
        enableShadows: false,
        fog: { enabled: true, color: new Color(0xc2d1d1), density: 0.04 },
      })
    )
    .registerSystem(Object3DSystem)
    .registerSystem(AssetSystem)
    .registerSystem(CameraSystem)
    .registerSystem(OrbitControlsSystem)
    .registerSystem(HemisphereLightSystem)
    .registerSystem(PointLightSystem)
    .registerSystem(MaterialSystem)
    .registerSystem(CCMaterialSystem)
    .registerSystem(StatsSystem)
    .registerSystem(FlickerSystem);

    world.init();
  })();
