import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { System } from "../ecs/index";
import { RenderSystem } from "./RenderSystem";

interface OrbitControlSystem extends System {
  controls: OrbitControls | null;
};

export const OrbitControlsSystem: OrbitControlSystem = {
  type: "OrbitControlsSystem",
  controls: null,
  queries: [],

  init: function (world) {
    const renderSystem = world.getSystem<RenderSystem>(RenderSystem.type);

    if (renderSystem) {
      const { camera, renderer } = renderSystem;

      if (camera && renderer) {
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.update();
      }
    }
  },

  tick: function () {
    if (this.controls) {
      this.controls.update();
    }
  },
};
