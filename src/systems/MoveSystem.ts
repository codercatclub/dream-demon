import { System } from "../ecs";
import { TransformC } from "../components";
import { applyQuery } from "../ecs";

interface MoveSystem extends System {
  initPos: typeof TransformC.data.position[];
}

export const MoveSystem: MoveSystem = {
  type: "MoveSystem",
  initPos: [],
  entities: [],

  init: function (world) {
    this.entities = applyQuery(world.entities, [TransformC]);

    this.initPos = this.entities.map((ent) => {
      const { position } = ent.components.get(
        TransformC.type
      ) as typeof TransformC.data;
      return {
        ...position,
      };
    });
  },

  tick: function (time) {
    this.entities.forEach((ent, i) => {
      let { position } = ent.components.get(
        TransformC.type
      ) as typeof TransformC.data;

      position.y = this.initPos[i].y + Math.cos(time + i) / 2;
    });
  },
};
