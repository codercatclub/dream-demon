import { System } from "../ecs/index";

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
  frameEnd: 350,
  isPlaying: false,

  init: function () {
    this.frame = this.frameStart;
  },

  setFrame: function (frame) {
    this.frame = frame;
  },

  play: function() {
    this.isPlaying = true;
  },

  pause: function() {
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
