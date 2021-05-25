import { TransformC, Object3DC } from "../components";
import { applyQuery } from "../ecs";

export const MoveSystem = {
  type: "MoveSystem",
  init: function (world) {
    const queries = [TransformC];

    this.entities = applyQuery(world.entities, queries);

    this.initPos = this.entities.map((ent) => ({
      ...ent.components.get(TransformC.type).position
    }));
  },

  tick: function (time) {
    this.entities.forEach((ent, i) => {
      let { position } = ent.components.get(TransformC.type);

      position.y = this.initPos[i].y + Math.cos(time + i) / 2;
    });
  },
};
