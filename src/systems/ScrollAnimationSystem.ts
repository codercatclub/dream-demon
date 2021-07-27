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
  lastRealDelta: number;
  moving: boolean;
}

export const ScrollAnimationSystem: ScrollAnimationSystem = {
  type: "ScrollAnimationSystem",
  queries: [TransformC, Object3DC, ScrollAnimationC],
  mixers: new Map(),
  scrollTime: 0,
  lastDelta: 0,
  lastRealDelta: 0,
  moving: false,

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
      this.lastDelta = 0.5 * Math.min(Math.max(event.deltaY, -5), 5);
    });
  },

  tick: function (_time, deltaTime) {
    let updateAmt = deltaTime * this.lastDelta;
    let newScrollTime = this.scrollTime + updateAmt;
    if (newScrollTime > 19.99) {
      updateAmt = Math.max(0, 19.99 - this.scrollTime);
    }

    if (Math.abs(updateAmt) > 0) {
      this.moving = true;
    } else {
      this.moving = false;
    }

    if (newScrollTime < 0.0) {
      updateAmt = -this.scrollTime;
    }
    this.lastRealDelta = updateAmt;
    this.scrollTime += updateAmt;
    this.mixers.forEach((m) => m.update(updateAmt));

    this.lastDelta = 0;
  },
};
