import * as THREE from "three";

export const RenderSystem = {
  type: "RenderSystem",
  systems: [],

  init: function (world) {
    this.animation = this.animation.bind(this);
    this.clock = new THREE.Clock();

    this.systems = world.systems.filter(s => s.type !== "RenderSystem");

    this.scene = world.scene;
    this.camera = world.activeCamera;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
  
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.animation);

    document.body.appendChild(this.renderer.domElement);
  },

  animation: function (time) {
    var delta = this.clock.getDelta();
    var elapsedTime = this.clock.elapsedTime;

    this.onFrameStart(elapsedTime, delta);

    this.tick(elapsedTime, delta);
  
    this.renderer.render(this.scene, this.camera);

    this.onFrameEnd(elapsedTime, delta);
  },

  tick: function (time, delta) {
    this.systems.forEach((s) => (s.tick ? s.tick(time, delta) : null));
  },

  onFrameStart: function (time, delta) {
    this.systems.forEach((s) =>
      s.onFrameStart ? s.onFrameStart(time, delta) : null
    );
  },

  onFrameEnd: function (time, delta) {
    this.systems.forEach((s) =>
      s.onFrameEnd ? s.onFrameEnd(time, delta) : null
    );
  },
};
