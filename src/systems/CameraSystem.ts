import { CamC, TransformC } from "../components";
import { applyQuery } from "../ecs";
import * as THREE from "three";
import { System } from "../ecs";

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

      world.activeCamera = cam;
    });
  },
};
