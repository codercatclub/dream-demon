import * as THREE from "three";
import { Object3DC, TransformC } from "../ecs/components";
import { applyQuery, Entity, System, World } from "../ecs/index";
import { getComponent } from "./utils";

interface Object3DSystem extends System {
  world: World | null;
  objects: Map<number, THREE.Object3D>;
  entities: Entity [];
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
    const { position: p, rotation: r, scale: s } = getComponent(ent, TransformC);
    const group = new THREE.Group();

    group.name = ent.id.toString();

    // Set initial transforms
    group.position.copy(p);
    group.rotation.set(r.x, r.y, r.z);
    group.scale.copy(s);

    // Assign group id to component data
    // that we can retrive it later
    ent.components.set(Object3DC.type, { object3d: group });

    this.world?.scene?.add(group);

    this.objects.set(group.id, group);
  },

  tick: function () {
    this.entities.forEach((ent) => {
      const { position: p, rotation: r, scale: s } = getComponent(ent, TransformC);
      const { object3d } = getComponent(ent, Object3DC);

      if (object3d) {
        // Update postion for each group from TransformC component
        object3d.position.copy(p);
        object3d.rotation.set(r.x, r.y, r.z);
        object3d.scale.copy(s);
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
