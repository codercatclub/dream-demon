import Stats from "stats.js";
import Event from '../event';
import { CamC, TransformC } from "../components";
import { applyQuery } from "../ecs";
import * as THREE from "three";

export const CameraSystem = {
  init: function (world) {
    const queries = [CamC, TransformC];

    this.entities = applyQuery(world.entities, queries);

    this.entities.forEach((ent) => {
      const camData = ent.components.get(CamC.type);
      const { position } = ent.components.get(TransformC.type);

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
    })
  },
};
