import { System } from "../ecs/index";
import { HemisphereLightC, TransformC, Object3DC } from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { getComponent } from "./utils";
import { HemisphereLight } from "three";

export const HemisphereLightSystem: System = {
  type: "HemisphereLightSystem",
  queries: [TransformC, Object3DC, HemisphereLightC],

  init: function (world) {
    this.entities = applyQuery(world.entities, this.queries);

    this.entities.forEach((ent) => {
      const { skyColor, groundColor, intensity } = getComponent(ent, HemisphereLightC);
      const { object3d } = getComponent(ent, Object3DC);

      const light = new HemisphereLight(skyColor, groundColor, intensity);

      object3d?.add(light);
    });
  },
};
