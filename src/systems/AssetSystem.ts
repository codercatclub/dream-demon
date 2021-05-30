import { System, World } from "../ecs";
import { TransformC, GLTFModelC, Object3DC } from "../components";
import { applyQuery, Entity } from "../ecs";

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

    if (this.world) {
      const parent = this.world.scene?.getObjectById(parseFloat(id));

      const asset = this.world.assets.get(src);
      if (!asset) {
        console.log(`[-] ${src} is not found in preloaded assets`);
        return;
      }

      parent?.add(asset.clone());
    }
  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], this.queries);
    entities.forEach(this.processEntity.bind(this));
  },
};
