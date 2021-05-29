import { System } from "../ecs";
import { TransformC, MovingC } from "../components";
import { applyQuery } from "../ecs";
import { Vector3 } from "three";

interface MoveSystem extends System {
  initValues: {
    position: Vector3,
    speed: number,
    amplitude: number
  }[];
}

export const MoveSystem: MoveSystem = {
  type: "MoveSystem",
  initValues: [],
  entities: [],

  init: function (world) {
    this.entities = applyQuery(world.entities, [TransformC, MovingC]);

    this.initValues = this.entities.map((ent) => {
      const { position } = ent.components.get(
        TransformC.type
      ) as typeof TransformC.data;
      const { speed, amplitude } = ent.components.get(
        MovingC.type
      ) as typeof MovingC.data;

      return {
        position: position.clone(), speed, amplitude,
      };
    });
  },

  tick: function (time) {
    this.entities.forEach((ent, i) => {
      let { position } = ent.components.get(
        TransformC.type
      ) as typeof TransformC.data;
      const iv =  this.initValues[i];

      position.y = iv.position.y + Math.cos(time + i * iv.speed) * iv.amplitude;
    });
  },
};
