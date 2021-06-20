import { Object3DC, GeometryC } from "../ecs/components";
import { applyQuery, Entity, World} from "../ecs/index";
import * as THREE from "three";
import { System } from "../ecs/index";

interface BasicPrimitivesSystem extends System {
  world: World | null;
  processEntity: (ent: Entity) => void;
}

/**
 * System responsible for creating basic primitives such as Box or Shere
 */
export const BasicPrimitivesSystem: BasicPrimitivesSystem = {
  type: "BasicPrimitivesSystem",
  entities: [],
  world: null,
  queries: [Object3DC, GeometryC],

  init: function (world) {
    this.world = world;
    this.entities = applyQuery(world.entities, this.queries);
    this.entities.forEach(this.processEntity.bind(this));
  },

  processEntity: function (ent) {
    const obj = ent.components.get(Object3DC.type) as typeof Object3DC.data;
    const geo = ent.components.get(GeometryC.type) as typeof GeometryC.data;

    let geometry = null;

    if (geo) {
      switch (geo.type) {
        case "Box":
          geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
          break;
        case "Sphere":
          geometry = new THREE.SphereGeometry(0.1, 0.1, 0.1);
          break;
      }

      if (geometry) {
        const material = new THREE.MeshNormalMaterial();
        const mesh = new THREE.Mesh(geometry, material);

        const obj3D = this.world?.scene?.getObjectById(parseFloat(obj.id));

        obj3D?.add(mesh);
      }
    }
  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], this.queries);
    entities.forEach(this.processEntity.bind(this));
  },
};
