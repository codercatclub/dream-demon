import { System } from "../ecs/index";
import { PointLightC, TransformC, Object3DC } from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { PointLight } from "three";
import { getObject3d, getComponent } from "./utils";

export const PointLightSystem: System = {
  type: "PointLightSystem",
  queries: [
    TransformC,
    Object3DC,
    PointLightC,
  ],

  init: function (world) {
    this.entities = applyQuery(world.entities, this.queries);

    this.entities.forEach((ent) => {
      const { color, intensity, distance } = getComponent(ent, PointLightC);
      const parent = getObject3d(ent, world);

      const light = new PointLight(color, intensity, distance);

      parent?.add(light);
    });
  },
};
