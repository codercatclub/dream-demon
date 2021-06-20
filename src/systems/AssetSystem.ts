import { System, World } from "../ecs/index";
import { TransformC, GLTFModelC, Object3DC } from "../ecs/components";
import { applyQuery, Entity } from "../ecs/index";
import {
  EquirectangularReflectionMapping,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Texture,
} from "three";
import { getObject3d, getComponent } from "./utils";

const setEnvTexture = (asset: Object3D, world: World): void => {
  asset.traverse((obj) => {
    if (obj.type === "Mesh") {
      const o = obj as Mesh;
      const texture = world.assets.get("assets/textures/env.jpg") as Texture;

      if (!texture) {
        console.warn(
          "Environmental texture is not loaded. PBR materials will not render correctly."
        );
        return;
      }

      texture.mapping = EquirectangularReflectionMapping;

      (o.material as MeshStandardMaterial).envMap = texture;
      (o.material as MeshStandardMaterial).needsUpdate = true;
    }
  });
};

interface AssetSystem extends System {
  world: World | null;
  processEntity(ent: Entity): void;
}

export const AssetSystem: AssetSystem = {
  type: "AssetSystem",
  world: null,
  queries: [TransformC, GLTFModelC, Object3DC],

  init: function (world) {
    this.world = world;
    this.entities = applyQuery(world.entities, this.queries);
    this.entities.forEach(this.processEntity.bind(this));
  },

  processEntity: function (ent: Entity) {
    const { src } = getComponent(ent, GLTFModelC);

    if (!this.world) {
      return;
    }

    const parent = getObject3d(ent, this.world);
  
    if (!parent) {
      console.warn('Can not attach asset to the scene. Entity is missing Object3D component.')
      return;
    }

    const asset = this.world.assets.get(src) as Object3D;

    if (!asset) {
      console.warn(`${src} is not found in preloaded assets`);
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
