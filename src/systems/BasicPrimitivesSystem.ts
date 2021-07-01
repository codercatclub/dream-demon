import { Object3DC, GeometryC } from "../ecs/components";
import { applyQuery, Entity, World} from "../ecs/index";
import * as THREE from "three";
import { System } from "../ecs/index";
import { getComponent } from "./utils";

interface BasicPrimitivesSystem extends System {
  world: World | null;
  processEntity: (ent: Entity) => void;
}

/**
 * System responsible for creating basic primitives such as Box or Shere
 */
export const BasicPrimitivesSystem: BasicPrimitivesSystem = {
  type: "BasicPrimitivesSystem",
  world: null,
  queries: [Object3DC, GeometryC],

  init: function (world) {
    this.world = world;
    this.entities = applyQuery(world.entities, this.queries);
    this.entities.forEach(this.processEntity.bind(this));
  },

  processEntity: function (ent) {
    const geo = getComponent(ent, GeometryC);
    const { object3d } = getComponent(ent, Object3DC);

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

      if (geometry && this.world) {
        const material = new THREE.MeshNormalMaterial();
        const mesh = new THREE.Mesh(geometry, material);

        object3d?.add(mesh);
      }
    }
  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], this.queries);
    entities.forEach(this.processEntity.bind(this));
  },
};
