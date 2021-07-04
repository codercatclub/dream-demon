import { System, World } from "../ecs/index";
import { TransformC, GLTFModelC, Object3DC } from "../ecs/components";
import { applyQuery, Entity } from "../ecs/index";
import {
  EquirectangularReflectionMapping,
  Mesh,
  MeshStandardMaterial,
  Object3D,
} from "three";
import { getComponent } from "./utils";

const findChild = (obj: Object3D, name: string) =>
  obj.children.find((c) => c.name === name);

const getObjectByPath = (obj: Object3D, path: string): Object3D | undefined => {
  const parts = path.split("/");

  parts.shift();

  let result: Object3D | undefined;

  for (let i = 0; i < parts.length; i++) {
    if (result) {
      result = findChild(result, parts[i]);
    } else {
      result = findChild(obj, parts[i]);
    }
  }

  return result;
};

const setEnvTexture = (asset: Object3D, world: World): void => {
  asset.traverse((obj) => {
    if (obj.type === "Mesh") {
      const o = obj as Mesh;
      const texture = world.assets.textures.get("assets/textures/env.jpg");

      // TODO (Kirill): Move it from here
      obj.castShadow = true;
      obj.receiveShadow = true;

      if (!texture) {
        console.warn(
          "Environmental texture is not loaded. PBR materials will not render correctly."
        );
        return;
      }

      texture.mapping = EquirectangularReflectionMapping;

      // (o.material as MeshStandardMaterial).envMap = texture;
      (o.material as MeshStandardMaterial).envMapIntensity = 0.1;
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
    const { src, part } = getComponent(ent, GLTFModelC);
    const { object3d: parent } = getComponent(ent, Object3DC);

    if (!this.world) {
      return;
    }

    if (!parent) {
      console.warn(
        "Can not attach asset to the scene. Entity is missing Object3D component."
      );
      return;
    }

    let asset = this.world.assets.objects.get(src);

    if (!asset) {
      console.warn(`${src} is not found in preloaded assets`);
      return;
    }

    if (part) {
      const obj = getObjectByPath(asset, part);
      if (obj) {
        asset = obj;
      } else {
        console.warn(`Can not fine part ${part} in object ${src}`);
      }
    }

    // We need to assign environmental texture to every asset
    // for PBR shader to work correctly
    setEnvTexture(asset, this.world);

    parent?.add(asset);
  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], this.queries);
    entities.forEach(this.processEntity.bind(this));
  },
};
