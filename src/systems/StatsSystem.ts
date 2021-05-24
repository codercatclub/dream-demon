import Stats from "stats.js";
import Event from '../event';

export const StatsSystem = {
  init: function (world) {
    this.stats = new Stats();
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
