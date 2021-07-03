import { System } from "../ecs/index";
import {
  TransformC,
  Object3DC,
  GLTFModelC,
  AnimationC,
} from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { getComponent } from "./utils";
import { AnimationMixer } from "three";

export interface AnimationSystem extends System {
  mixer: AnimationMixer | null;
}

export const AnimationSystem: AnimationSystem = {
  type: "AnimationSystem",
  queries: [TransformC, Object3DC, AnimationC],
  mixer: null,

  init: function (world) {
    this.entities = applyQuery(world.entities, this.queries);

    this.entities.forEach((ent) => {
      const { src } = getComponent(ent, GLTFModelC);
      const { object3d } = getComponent(ent, Object3DC);

      const animClips = world.assets.animations.get(src);

      this.mixer = new AnimationMixer(object3d);

      animClips?.forEach((clip) => {
        this.mixer?.clipAction(clip).play();
      });
    });
  },

  tick: function (_time, deltaTime) {
    if (this.mixer) this.mixer.update(deltaTime);
  },
};
