import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const OrbitControlsSystem = {
  init: function (world) {
    const entities = world.systems.filter((s) => s.type === "RenderSystem");

    if (entities.length > 0) {
      const { camera, renderer } = entities[0];

      this.controls = new OrbitControls(camera, renderer.domElement);

      this.controls.update();
    }
  },

  tick: function () {
    if (this.controls) {
      this.controls.update();
    }
  },
};
