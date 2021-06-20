import { CamC, TransformC } from "../components";
import { applyQuery } from "../ecs";
import * as THREE from "three";
import { System } from "../ecs";
import { RenderSystem } from "./RenderSystem";

export const CameraSystem: System = {
  type: "CameraSystem",
  entities: [],
  queries: [CamC, TransformC],

  init: function (world) {
    this.entities = applyQuery(world.entities, this.queries);

    this.entities.forEach((ent) => {
      const camData = ent.components.get(CamC.type) as typeof CamC.data;
      const { position } = ent.components.get(
        TransformC.type
      ) as typeof TransformC.data;

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

      // TODO (Kirill): Overriding render system default camera is not idel. There should be a setCamera method or something more generic.
      // perhaps render system should search for existing camera... 
      const renderSystem = world.systems.filter((s) => s.type === "RenderSystem")[0] as RenderSystem;
      renderSystem.camera = cam;
    });
  },
};
