import { System, World } from "../ecs";
import { TransformC, GLTFModelC, Object3DC } from "../components";
import { applyQuery, Entity } from "../ecs";
import {
  EquirectangularReflectionMapping,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Texture,
} from "three";

const setEnvTexture = (asset: Object3D, world: World): void => {
  asset.traverse((obj) => {
    if (obj.type === "Mesh") {
      const o = obj as Mesh;
      const texture = world.assets.get(
        "assets/textures/env.jpg"
      ) as Texture;

      if (!texture) {
        return;
      }

      texture.mapping = EquirectangularReflectionMapping;

      (o.material as MeshStandardMaterial).envMap = texture;
      // (o.material as MeshStandardMaterial).map = null;
      // (o.material as MeshStandardMaterial).normalMap = null;
      // (o.material as MeshStandardMaterial).roughness = 0;
      // (o.material as MeshStandardMaterial).metalness = 0;
      (o.material as MeshStandardMaterial).needsUpdate = true;
    }
  });
}

interface AssetSystem extends System {
  world: World | null;
  processEntity(ent: Entity): void;
}

export const AssetSystem: AssetSystem = {
  type: "AssetSystem",
  world: null,
  queries: [TransformC, GLTFModelC, Object3DC],
  entities: [],

  init: function (world) {
    this.world = world;
    this.entities = applyQuery(world.entities, this.queries);
    this.entities.forEach(this.processEntity.bind(this));
  },

  processEntity: function (ent: Entity) {
    const { src } = ent.components.get(
      GLTFModelC.type
    ) as typeof GLTFModelC.data;
    const { id } = ent.components.get(Object3DC.type) as typeof Object3DC.data;

    if (!this.world) {
      return;
    }

    const parent = this.world.scene?.getObjectById(parseFloat(id));

    if (!parent) {
      return;
    }

    const asset = this.world.assets.get(src) as Object3D;

    if (!asset) {
      console.log(`[-] ${src} is not found in preloaded assets`);
      return;
    }

    // We need to assign environmental texture to every asset
    // for PBR shader to work correctly
    setEnvTexture(asset, this.world);

    parent?.add(asset.clone());
  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], this.queries);
    entities.forEach(this.processEntity.bind(this));
  },
};
