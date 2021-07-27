import { System } from "../ecs/index";
import { TransformC, Object3DC, AudioC, FirstPersonC } from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { getComponent } from "./utils";
import { ScrollAnimationSystem } from "./ScrollAnimationSystem";

export interface FirstPersoSystem extends System {
  lastPlayTime: number;
  scrollSys: ScrollAnimationSystem | undefined;
}

export const FirstPersoSystem: FirstPersoSystem = {
  type: "FirstPersoSystem",
  queries: [TransformC, Object3DC, FirstPersonC],
  lastPlayTime: 0,

  init: function (world) {  
    this.entities = applyQuery(world.entities, this.queries);

    this.scrollSys = world.getSystem<ScrollAnimationSystem>(ScrollAnimationSystem.type);
    
    this.entities.forEach((ent) => {
      const cmp = getComponent(ent, AudioC);
      // const { src, volume } = cmp;
      console.log('Audio', cmp);
    });
  },

  tick: function (time) {
    this.entities?.forEach((ent) => {
      const { audio } = getComponent(ent, AudioC);
      
      // TODO (Kirill): Trigger step sound based on camera Y position
      // Add A and B sounds
      if (this.scrollSys?.moving && (time - this.lastPlayTime) > 1) {
        audio?.play();
        this.lastPlayTime = time;
      }

    });
  }
};
