import { Entity, System } from "../ecs/index";
import { TransformC, MovingC } from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { Vector3 } from "three";
import { getComponent } from "./utils";

interface MoveSystem extends System {
  initValues: {
    position: Vector3;
    speed: number;
    amplitude: number;
  }[];
  entities: Entity[];
}

const getInitValues = (ent: Entity) => {
  const { position } = getComponent(ent, TransformC);
  const { speed, amplitude } = getComponent(ent, MovingC);

  return {
    position: position.clone(),
    speed,
    amplitude,
  };
};

export const MoveSystem: MoveSystem = {
  type: "MoveSystem",
  initValues: [],
  queries: [TransformC, MovingC],
  entities: [],

  init: function (world) {
    this.entities = applyQuery(world.entities, this.queries);
    this.initValues = this.entities.map(getInitValues);
  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], this.queries);
    this.entities = this.entities.concat(entities);
    this.initValues = this.initValues.concat(entities.map(getInitValues));
  },

  tick: function (time) {
    this.entities.forEach((ent, i) => {
      let { position } = getComponent(ent, TransformC);
      const iv = this.initValues[i];

      position.y = iv.position.y + Math.cos(time + i * iv.speed) * iv.amplitude;
    });
  },
};
