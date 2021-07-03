import { CamC, TransformC } from "../ecs/components";
import { applyQuery } from "../ecs/index";
import * as THREE from "three";
import { System } from "../ecs/index";
import { RenderSystem } from "./RenderSystem";
import { getComponent } from "./utils";


export const CameraSystem: System = {
  type: "CameraSystem",
  queries: [CamC, TransformC],

  init: function (world) {
    this.entities = applyQuery(world.entities, this.queries);

    this.entities.forEach((ent) => {
      const camData = getComponent(ent, CamC);
      const { position } = getComponent(ent, TransformC);

      const cam = new THREE.PerspectiveCamera(
        camData.fov,
        camData.aspect,
        camData.near,
        camData.far
      );

      cam.position.x = position.x;
      cam.position.y = position.y;
      cam.position.z = position.z;

      ent.components.set(CamC.type, cam);

      const renderSystem = world.systems.filter((s) => s.type === "RenderSystem")[0] as RenderSystem;
      renderSystem.camera = cam;
    });
  },
};
