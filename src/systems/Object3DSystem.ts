import * as THREE from "three";
import { Object3DC, TransformC } from "../components";
import { applyQuery } from "../ecs";

export const Object3DSystem = {
  init: function (world) {
    this.entities = applyQuery(world.entities, [TransformC, Object3DC]);

    this.scene = world.scene;
    this.objects = new Map();

    this.entities.forEach((ent) => {
      const { position: p, scale: s } = ent.components.get(TransformC.type);
      const group = new THREE.Group();

      group.name = ent.id;

      // Set initial transforms
      group.position.set(p.x, p.y, p.z);
      group.scale.set(s.x, s.y, s.z);

      // Assign group id to component data
      // that we can retrive it later
      ent.components.set(Object3DC.type, { id: group.id });

      this.scene.add(group);

      this.objects.set(group.id, group);
    });
  },

  tick: function () {
    this.entities.forEach((ent, i) => {
      const { position: p } = ent.components.get(TransformC.type);
      const obj = ent.components.get(Object3DC.type);

      const obj3D = this.objects.get(obj.id);

      if (obj3D) {
        // Update postion for each group from TransformC component
        obj3D.position.set(p.x, p.y, p.z);
      }
    });
  },

  onEntityRemove: function (id) {
    const obj = this.scene.getObjectByName(id);
    this.scene.remove(obj);
  },
};
