import { extend, World, newComponent, newEntity } from "./ecs/index";
import { RenderSystem } from "./systems/RenderSystem";
import { Object3DSystem } from "./systems/Object3DSystem";
import { OrbitControlsSystem } from "./systems/OrbitControlsSystem";
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
  CharAnimationC,
  ScrollAnimationC,
  ConstraintLookC,
  LinkTransformC,
  Object3DC,
  TransformC,
  AudioC,
  FirstPersonC,
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
import { CharAnimationSystem } from "./systems/CharAnimationSystem";
import { ScrollAnimationSystem } from "./systems/ScrollAnimationSystem";
import { ConstraintLookSystem } from "./systems/ConstrainLookSystem";
import { LinkTransformSystem } from "./systems/LinkTransformSystem";
import { AudioSystem } from "./systems/AudioSystem";
import { FirstPersoSystem } from "./systems/FirstPersonSystem";

(async () => {
  const assetManager = new AssetManager();

  assetManager
    .addAsset("assets/models/char.glb", "char")
    .addAsset("assets/models/frame.glb", "frame")
    .addAsset("assets/models/walls.glb", "walls")
    .addAsset("assets/models/rocks.glb", "rocks")
    .addAsset("assets/models/props.glb", "props")
    .addAsset("assets/models/wires.glb", "wires")
    .addAsset("assets/models/bodywires.glb", "bodywires")
    .addAsset("assets/models/candles.glb", "candles")
    .addAsset("assets/models/roof.glb", "roof")
    .addAsset("assets/models/ground.glb", "ground")
    .addAsset("assets/models/branches.glb", "branches")
    .addAsset("assets/models/chair.glb", "chair")
    .addAsset("assets/models/wall_decor.glb", "wall_decor")
    .addAsset("assets/models/lights.glb", "lights")
    .addAsset("assets/models/cameras.glb", "cameras")
    .addAsset("assets/timeline.json", "timeline_data")
    .addAsset("assets/sounds/abandoned_cathedral.mp3", "ambient_sound")
    .addAsset("assets/sounds/tentacle_movement.mp3", "body_wire_sound")
    .addAsset("assets/sounds/ambi.mp3", "body_ambi_sound")
    .addAsset("assets/sounds/step_a.mp3", "step_a_sound")
    .addAsset("assets/textures/env.jpg", "env_tex"); // Environmental texture for PBR material.

  // Wait untill all assets are loaded
  await assetManager.load();

  const world = new World(assetManager.loadedAssets);

  const cam = Camera(new Vector3(0, 2, 4));

  const ambientSound = newEntity([
    Object3DC,
    TransformC,
    newComponent(AudioC, {
      src: "assets/sounds/abandoned_cathedral.mp3",
      autoplay: true,
    }),
  ]);

  const bodyWireSound = newEntity([
    Object3DC,
    TransformC,
    newComponent(AudioC, {
      src: "assets/sounds/tentacle_movement.mp3",
      autoplay: true,
      scrollPlayTime: 16,
      scrollStopTime: 18.5,
      volume: 0.1,
      loop: true,
    }),
  ]);

  const bodyAmbiSound = newEntity([
    Object3DC,
    TransformC,
    newComponent(AudioC, {
      src: "assets/sounds/ambi.mp3",
      autoplay: true,
      scrollPlayTime: 17.5,
      volume: 2,
      loop: true,
    }),
  ]);

  const char = extend(
    Asset({
      src: "assets/models/char.glb",
    }),
    [newComponent(CharAnimationC), newComponent(VoidMaterialC, {})]
  );

  const frame = extend(
    Asset({
      src: "assets/models/frame.glb",
    }),
    [newComponent(CCMaterialC, {})]
  );

  const walls = extend(
    Asset({
      src: "assets/models/walls.glb",
    }),
    [newComponent(CCMaterialC, {})]
  );

  const roof = extend(
    Asset({
      src: "assets/models/roof.glb",
    }),
    [newComponent(CCMaterialC, {})]
  );

  const ground = extend(
    Asset({
      src: "assets/models/ground.glb",
    }),
    [newComponent(CCMaterialC, {})]
  );

  const chair = extend(
    Asset({
      src: "assets/models/chair.glb",
    }),
    [newComponent(CCMaterialC, {})]
  );

  const wall_decor = extend(
    Asset({
      src: "assets/models/wall_decor.glb",
    }),
    [newComponent(CCMaterialC, {})]
  );

  const branches = extend(
    Asset({
      src: "assets/models/branches.glb",
    }),
    [newComponent(CCMaterialC, {})]
  );

  const rocks = extend(
    Asset({
      src: "assets/models/rocks.glb",
    }),
    [newComponent(CCMaterialC, {})]
  );

  const candles = extend(
    Asset({
      src: "assets/models/candles.glb",
    }),
    [newComponent(CCMaterialC, {})]
  );

  const props = extend(
    Asset({
      src: "assets/models/props.glb",
    }),
    [newComponent(CCMaterialC, {})]
  );

  const wires = extend(
    Asset({
      src: "assets/models/wires.glb",
    }),
    [
      /* newComponent(CCMaterialC, {}) */
    ]
  );

  const body_wires = extend(
    Asset({
      src: "assets/models/bodywires.glb",
    }),
    [
      newComponent(LinkTransformC, { targetName: "Thorax" }),
      newComponent(VineMaterialC, {}),
    ]
  );

  const cameras = extend(
    Asset({
      src: "assets/models/cameras.glb",
    }),
    [
      GLTFCameraC,
      ConstraintLookC,
      ScrollAnimationC,
      FirstPersonC,
      newComponent(AudioC, {
        src: "assets/sounds/step_a.mp3",
        volume: 1
      }),
    ]
  );

  const lights = extend(
    Asset({
      src: "assets/models/lights.glb",
    }),
    [GLTFLigthsC, FlickerC]
  );

  world
    .addEntity(cam)
    .addEntity(frame)
    .addEntity(walls)
    .addEntity(roof)
    .addEntity(ground)
    .addEntity(chair)
    .addEntity(wall_decor)
    .addEntity(wires)
    .addEntity(candles)
    .addEntity(branches)
    .addEntity(rocks)
    .addEntity(props)
    .addEntity(cameras)
    .addEntity(lights)
    .addEntity(char)
    .addEntity(body_wires)
    .addEntity(ambientSound)
    .addEntity(bodyWireSound)
    .addEntity(bodyAmbiSound)

  world
    .registerSystem(
      RenderSystem.configure({
        enableShadows: false,
        fog: { enabled: true, color: new Color(0xc2d1d1), density: 0.02 },
      })
    )
    .registerSystem(Object3DSystem)
    .registerSystem(AssetSystem)
    .registerSystem(CameraSystem)
    .registerSystem(AudioSystem)
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
    .registerSystem(ScrollAnimationSystem)
    .registerSystem(CharAnimationSystem)
    .registerSystem(ConstraintLookSystem)
    .registerSystem(LinkTransformSystem)
    .registerSystem(FirstPersoSystem);

  world.init();
})();
