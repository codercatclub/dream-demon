import { System, World } from "../ecs/index";
import { TransformC, Object3DC, AudioC } from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { getComponent } from "./utils";
import { Audio, AudioListener } from "three";
import { RenderSystem } from "./RenderSystem";
import { ScrollAnimationSystem } from "./ScrollAnimationSystem";

export interface AudioSystem extends System {
  world: World | null;
  muted: boolean;
  isPlaying: boolean;
  playAll: () => void;
  muteAll: () => void;
  unmuteAll: () => void;
}

export const AudioSystem: AudioSystem = {
  type: "AudioSystem",
  queries: [TransformC, Object3DC, AudioC],
  muted: false,
  isPlaying: false,
  world: null,

  init: function (world) {
    this.world = world;
    this.entities = applyQuery(world.entities, this.queries);
    const renderSystem = world.getSystem<RenderSystem>(RenderSystem.type);

    const audioListener = new AudioListener();

    renderSystem?.camera?.add(audioListener);

    this.entities.forEach((ent) => {
      const cmp = getComponent(ent, AudioC);
      const { src, volume, loop } = cmp;

      const audioBuffer = world.assets.audio.get(src);

      if (audioBuffer) {
        const audio = new Audio(audioListener);

        audio.setBuffer(audioBuffer);
        audio.setVolume(volume);
        audio.loop = loop;

        cmp.audio = audio;
      } else {
        console.warn(
          `No sound data found for a given source ${src}`,
          "Check if audio file is loaded corectly."
        );
      }
    });

    this.muteAll();

    // Autoplay
    this.entities?.forEach((ent) => {
      const { audio, autoplay } = getComponent(ent, AudioC);
      if (autoplay) {
        this.isPlaying = true;
        audio?.play();
      }
    });

    window.addEventListener("play-sounds", (() => {
      this.unmuteAll();
    }) as EventListener);

    window.addEventListener("stop-sounds", (() => {
      this.muteAll();
    }) as EventListener);
  },

  playAll: function () {
    this.isPlaying = true;

    this.entities?.forEach((ent) => {
      const { audio } = getComponent(ent, AudioC);
      audio?.play();
    });
  },

  muteAll: function () {
    this.muted = true;

    this.entities?.forEach((ent) => {
      const { audio } = getComponent(ent, AudioC);
      audio?.setVolume(0);
    });
  },

  unmuteAll: function () {
    this.muted = false;

    this.entities?.forEach((ent) => {
      const { audio, volume } = getComponent(ent, AudioC);
      audio?.setVolume(volume);
    });
  },

  tick: function() {
    const scrollAnimSystem = this.world?.getSystem<ScrollAnimationSystem>(ScrollAnimationSystem.type);
    let scrollTime = scrollAnimSystem?.scrollTime || 0;
    this.entities?.forEach((ent) => {
      const { audio, volume, scrollPlayTime, scrollStopTime, fadeTime } = getComponent(ent, AudioC);
      if(scrollPlayTime > 0) {


        const fadeT = Math.min(1, Math.max(0, scrollTime - scrollPlayTime) / fadeTime);

        const f = fadeT - Math.min(1, Math.max(0, scrollTime - scrollStopTime) / 0.6);

        if(!this.muted) {
          audio?.setVolume(f * volume);
        }
      }
    });

  }
};
