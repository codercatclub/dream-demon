import * as THREE from "three";
import { RenderC, PosC } from "../components";
import { applyQuery } from "../ecs";

export const Object3DSystem = {
  init: function (world) {
    const queries = [PosC, RenderC];
    this.scene = world.scene;

    this.entities = applyQuery(world.entities, queries);

    this.objects = new Map();

    this.entities.forEach((ent) => {
      const p = ent.components.get(PosC.type);

      const group = new THREE.Group();

      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      const material = new THREE.MeshNormalMaterial();

      const mesh = new THREE.Mesh(geometry, material);

      group.name = ent.id;

      group.add(mesh);

      // Set initial positin
      group.position.set(p.x, p.y, p.z);

      // Assign group to component data
      ent.components.set(RenderC.type, group);

      this.scene.add(group);
    });
  },

  tick: function () {
    this.entities.forEach((ent) => {
      const p = ent.components.get(PosC.type);
      const group = ent.components.get(RenderC.type);

      if (group) {
        group.position.set(p.x, p.y, p.z);
      }
    });
  },

  onEntityRemove: function (id) {
    const obj = this.scene.getObjectByName(id);
    this.scene.remove(obj);
  }
};
