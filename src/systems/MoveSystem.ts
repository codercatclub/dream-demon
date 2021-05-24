import { PosC, RenderC } from "../components";
import { applyQuery } from "../ecs";

export const MoveSystem = {
  type: "MoveSystem",
  init: function (world) {
    const queries = [PosC];

    this.entities = applyQuery(world.entities, queries);

    this.initPos = this.entities.map((ent) => ({
      ...ent.components.get(PosC.type),
    }));
  },

  tick: function (time) {
    this.entities.forEach((ent, i) => {
      let pos = ent.components.get(PosC.type);

      pos.y = this.initPos[i].y + Math.cos(time + i) / 2;
    });
  },
};
