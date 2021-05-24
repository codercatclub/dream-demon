import Stats from "stats.js";
import Event from '../event';
import { CamC, PosC } from "../components";
import { applyQuery } from "../ecs";
import * as THREE from "three";

export const CameraSystem = {
  init: function (world) {
    const queries = [CamC, PosC];

    this.entities = applyQuery(world.entities, queries);

    this.entities.forEach((ent) => {
      const camData = ent.components.get(CamC.type);
      const pos = ent.components.get(PosC.type);

      const cam = new THREE.PerspectiveCamera(
        camData.fov,
        camData.aspect,
        camData.near,
        camData.far
      );
    
      cam.position.x = pos.x;
      cam.position.y = pos.y;
      cam.position.z = pos.z;
  
      ent.components.set(CamC.type, cam);

      world.activeCamera = cam;
    })
  },
};
