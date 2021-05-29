import { System } from "../ecs";
import { TransformC, GLTFModelC, Object3DC } from "../components";
import { applyQuery } from "../ecs";

export const AssetSystem: System = {
  type: "AssetSystem",
  entities: [],

  init: function (world) {
    this.entities = applyQuery(world.entities, [
      TransformC,
      GLTFModelC,
      Object3DC,
    ]);

    this.entities.forEach((ent) => {
      const { src } = ent.components.get(
        GLTFModelC.type
      ) as typeof GLTFModelC.data;
      const { id } = ent.components.get(
        Object3DC.type
      ) as typeof Object3DC.data;

      const parent = world.scene?.getObjectById(parseFloat(id));

      const asset = world.assets.get(src);

      if (!asset) {
        console.log(`[-] ${src} is not found in preloaded assets`);
        return;
      }

      parent?.add(asset);
    });
  },
};
