import { System } from "../ecs/index";

interface TimelineMarker {
  name: string;
  frame: number;
}

interface TimelineData {
  frameStart: number;
  frameEnd: number;
  markers: TimelineMarker[];
}

export interface TimelineSystem extends System {
  frame: number;
  frameStart: number;
  frameEnd: number;
  isPlaying: boolean;
  setFrame(frame: number): void;
  play: () => void;
  pause: () => void;
}

export const TimelineSystem: TimelineSystem = {
  type: "TimelineSystem",
  queries: [],
  frame: 0,
  frameStart: 0,
  frameEnd: 250,
  isPlaying: false,

  init: function (world) {
    this.frame = this.frameStart;

    const sceneData = world.assets.sceneData.get("assets/timeline.json") as
      | TimelineData
      | undefined;

    if (sceneData) {
      const { markers, frameStart, frameEnd } = sceneData;
      this.frameStart = frameStart;
      this.frameEnd = frameEnd;
    }
  },

  setFrame: function (frame) {
    this.frame = frame;
  },

  play: function () {
    this.isPlaying = true;
  },

  pause: function () {
    this.isPlaying = false;
  },

  tick: function () {
    if (this.isPlaying) {
      if (this.frame >= this.frameEnd) {
        this.frame = this.frameStart;
      } else {
        this.frame += 1;
      }
    }
  },
};
