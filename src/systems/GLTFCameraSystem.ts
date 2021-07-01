import { System } from "../ecs/index";
import {
  TransformC,
  Object3DC,
  GLTFCameraC,
  GLTFModelC,
} from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { getComponent } from "./utils";
import { PerspectiveCamera, AnimationMixer } from "three";
import { RenderSystem } from "./RenderSystem";

export interface GLTFCameraSystem extends System {
  mixer: AnimationMixer | null;
}

export const GLTFCameraSystem: GLTFCameraSystem = {
  type: "GLTFCameraSystem",
  queries: [TransformC, Object3DC, GLTFCameraC],
  mixer: null,

  init: function (world) {
    this.entities = applyQuery(world.entities, this.queries);

    this.entities.forEach((ent) => {
      const { object3d } = getComponent(ent, Object3DC);
      const { src } = getComponent(ent, GLTFModelC);

      const cam = object3d.getObjectByProperty(
        "type",
        "PerspectiveCamera"
      ) as PerspectiveCamera;

      // Set aspect ratio based on window size
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();

      const animClips = world.assets.animations.get(src);

      if (animClips && animClips.length > 0) {
        this.mixer = new AnimationMixer(object3d);
        const clip1 = animClips[0];
        const action1 = this.mixer?.clipAction(clip1);
        action1?.play();
      }

      const renderSystem = world.systems.filter(
        (s) => s.type === "RenderSystem"
      )[0] as RenderSystem;
      renderSystem?.setCamera(cam);
    });
  },

  tick: function (_time, deltaTime) {
    if (this.mixer) this.mixer.update(deltaTime);
  },
};
