import Stats from "stats.js";
import { System } from "../ecs/index";
import Event from '../ecs/event';

interface StatsSystem extends System {
  stats: Stats;
}

export const StatsSystem: StatsSystem = {
  type: "StatsSystem",
  stats: new Stats(),
  queries: [],

  init: function () {
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);
    
    Event.fire("stats.loaded"); // doSomething() is called
  },

  onFrameStart: function () {
    this.stats.begin();
  },

  onFrameEnd: function () {
    this.stats.end();
  },
};
