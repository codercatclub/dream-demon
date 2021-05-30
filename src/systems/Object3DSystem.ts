import * as THREE from "three";
import { Object3DC, TransformC } from "../components";
import { applyQuery, Entity, System, World } from "../ecs";

interface Object3DSystem extends System {
  world: World | null;
  objects: Map<number, THREE.Object3D>;
  processEntity: (ent: Entity) => void;
}

export const Object3DSystem: Object3DSystem = {
  type: "Object3DSystem",
  queries: [TransformC, Object3DC],
  world: null,
  objects: new Map(),
  entities: [],

  init: function (world) {
    this.world = world;
    this.entities = applyQuery(world.entities, this.queries);
    this.entities.forEach(this.processEntity.bind(this));
  },

  processEntity: function (ent: Entity) {
    const { position: p, rotation: r, scale: s } = ent.components.get(
      TransformC.type
    ) as typeof TransformC.data;
    const group = new THREE.Group();

    group.name = ent.id.toString();

    // Set initial transforms
    group.position.copy(p);
    group.rotation.set(r.x, r.y, r.z);
    group.scale.copy(s);

    // Assign group id to component data
    // that we can retrive it later
    ent.components.set(Object3DC.type, { id: group.id });

    this.world?.scene?.add(group);

    this.objects.set(group.id, group);
  },

  tick: function () {
    this.entities.forEach((ent) => {
      const { position: p, rotation: r, scale: s } = ent.components.get(
        TransformC.type
      ) as typeof TransformC.data;
      const obj = ent.components.get(Object3DC.type) as typeof Object3DC.data;

      const obj3D = this.objects.get(parseFloat(obj.id));

      if (obj3D) {
        // Update postion for each group from TransformC component
        obj3D.position.copy(p);
        obj3D.rotation.set(r.x, r.y, r.z);
        obj3D.scale.copy(s);
      }
    });
  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], [TransformC, Object3DC]);
    this.entities = this.entities.concat(entities);
    entities.forEach(this.processEntity.bind(this));
  },

  onEntityRemove: function (id: number) {
    const obj = this.world?.scene?.getObjectByName(id.toString());
    if (obj) {
      this.world?.scene?.remove(obj);
    }
  },
};
