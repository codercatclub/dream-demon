import * as THREE from "three";
import { Object3DC, TransformC } from "../components";
import { applyQuery, System } from "../ecs";

interface Object3DSystem extends System {
  scene: THREE.Scene | null;
  objects: Map<number, THREE.Object3D>;
}

export const Object3DSystem: Object3DSystem = {
  type: "Object3DSystem",
  scene: null,
  objects: new Map(),
  entities: [],

  init: function (world) {
    this.entities = applyQuery(world.entities, [TransformC, Object3DC]);

    this.scene = world.scene;

    this.entities.forEach((ent) => {
      const { position: p, scale: s } = ent.components.get(
        TransformC.type
      ) as typeof TransformC.data;
      const group = new THREE.Group();

      group.name = ent.id.toString();

      // Set initial transforms
      group.position.set(p.x, p.y, p.z);
      group.scale.set(s.x, s.y, s.z);

      // Assign group id to component data
      // that we can retrive it later
      ent.components.set(Object3DC.type, { id: group.id });

      this.scene?.add(group);

      this.objects.set(group.id, group);
    });
  },

  tick: function () {
    this.entities.forEach((ent) => {
      const { position: p } = ent.components.get(TransformC.type) as typeof TransformC.data;
      const obj = ent.components.get(Object3DC.type) as typeof Object3DC.data;

      const obj3D = this.objects.get(parseFloat(obj.id));

      if (obj3D) {
        // Update postion for each group from TransformC component
        obj3D.position.set(p.x, p.y, p.z);
      }
    });
  },

  onEntityRemove: function (id: number) {
    const obj = this.scene?.getObjectByName(id.toString());
    if (obj) {
      this.scene?.remove(obj);
    }
  },
};
