import { System } from "../ecs/index";
import { TransformC, Object3DC, AudioC } from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { getComponent } from "./utils";
import { Audio, AudioListener } from "three";
import { RenderSystem } from "./RenderSystem";

export interface AudioSystem extends System {
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

  init: function (world) {
    this.entities = applyQuery(world.entities, this.queries);
    const renderSystem = world.getSystem<RenderSystem>(RenderSystem.type);

    const audioListener = new AudioListener();

    renderSystem?.camera?.add(audioListener);

    this.entities.forEach((ent) => {
      const cmp = getComponent(ent, AudioC);
      const { src, volume } = cmp;

      const audioBuffer = world.assets.audio.get(src);

      if (audioBuffer) {
        const audio = new Audio(audioListener);

        audio.setBuffer(audioBuffer);
        audio.setVolume(volume);

        cmp.audio = audio;
      } else {
        console.warn(
          `No sound data found for a given source ${src}`,
          "Check if audio file is loaded corectly."
        );
      }
    });

    this.muteAll();
    this.playAll();

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
};
