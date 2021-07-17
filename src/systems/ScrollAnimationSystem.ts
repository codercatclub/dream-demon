import { System } from "../ecs/index";
import {
  TransformC,
  Object3DC,
  GLTFModelC,
  ScrollAnimationC,
} from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { getComponent } from "./utils";
import { AnimationMixer } from "three";

export interface ScrollAnimationSystem extends System {
  mixers: Map<string, AnimationMixer>;
  scrollTime: number;
  lastDelta: number;
}

export const ScrollAnimationSystem: ScrollAnimationSystem = {
  type: "ScrollAnimationSystem",
  queries: [TransformC, Object3DC, ScrollAnimationC],
  mixers: new Map(),
  scrollTime: 0,
  lastDelta: 0,

  init: function (world) {
    this.entities = applyQuery(world.entities, this.queries);

    this.entities.forEach((ent) => {
      const { src } = getComponent(ent, GLTFModelC);
      const { object3d } = getComponent(ent, Object3DC);

      const animClips = world.assets.animations.get(src);

      const mixer = new AnimationMixer(object3d);

      this.mixers.set(src, mixer);

      animClips?.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
    });


    //get current time by scroll amount 
    document.addEventListener("wheel", (event) => {
      event.preventDefault();
      this.lastDelta = 0.5*event.deltaY;
    });
  },

  tick: function (_time, deltaTime) {
    this.scrollTime += deltaTime * this.lastDelta;
    this.mixers.forEach((m) => m.update(deltaTime * this.lastDelta));
    this.lastDelta = 0;
  },
};
