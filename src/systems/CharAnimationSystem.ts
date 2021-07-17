import { Entity, System, World } from "../ecs/index";
import {
  TransformC,
  Object3DC,
  GLTFModelC,
  CharAnimationC,
} from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { getComponent } from "./utils";
import { AnimationClip, AnimationMixer,LoopOnce } from "three";
import { ScrollAnimationSystem } from "./ScrollAnimationSystem";

export interface CharAnimationSystem extends System {
  world: World | null;
  mixer: AnimationMixer | null;
  char: Entity | null;
  idleClip: AnimationClip | undefined;
  eruptionClip: AnimationClip | undefined;
  reset: boolean;
  lastAnimT: number;
}

export const CharAnimationSystem: CharAnimationSystem = {
  type: "CharAnimationSystem",
  world: null,
  char: null,
  idleClip: undefined,
  eruptionClip: undefined,
  queries: [TransformC, Object3DC, CharAnimationC],
  mixer: null,
  reset: false,
  lastAnimT: 0,

  init: function (world) {
    this.world = world;

    this.char = applyQuery(world.entities, this.queries)[0];
    const { src } = getComponent(this.char, GLTFModelC);
    const { object3d } = getComponent(this.char, Object3DC);
    const animClips = world.assets.animations.get(src);
    const mixer = new AnimationMixer(object3d);
    this.mixer = mixer;
    this.idleClip = animClips?.filter((c) => c.name === "Idle")[0];
    this.eruptionClip = animClips?.filter((c) => c.name === "Eruption")[0];

    if(this.idleClip) {
      mixer.clipAction(this.idleClip).play();
    }
    if(this.eruptionClip) {
      mixer.clipAction(this.eruptionClip).play();
      mixer.clipAction(this.eruptionClip).setEffectiveWeight(0);
    }
  },

  tick: function (_time, deltaTime) {
    let fadeDur = 0.75;
    let animDur = 1.6;
    let eruptStartTime = 17.2;

    const scrollAnimSystem = this.world?.getSystem<ScrollAnimationSystem>(ScrollAnimationSystem.type);
    if(scrollAnimSystem) {
      let scrollTime = scrollAnimSystem.scrollTime;
      const fadeT = Math.min(1, Math.max(0, scrollTime - eruptStartTime) / fadeDur);
      const animT = Math.min(1, Math.max(0, scrollTime - eruptStartTime) / animDur);
      if(this.mixer && this.eruptionClip && this.idleClip) {
        this.mixer.clipAction(this.eruptionClip).setEffectiveWeight(fadeT);
        if(fadeT > 0 && !this.reset) {
          this.mixer.clipAction(this.eruptionClip).time = 0;
          this.reset = true;
        }
        if(fadeT <= 0) {
          this.reset = false;
        }
      }

      let animTDif = animT - this.lastAnimT;

      if(animT > 0.999) {
        //no mixer update
        this.mixer?.update(animDur*(1.0 - this.lastAnimT));
      } else if (fadeT > 0) {
        this.mixer?.update(animDur*animTDif);
      } else {
        this.mixer?.update(deltaTime);
      }

      this.lastAnimT = animT;

    }
  },
};
