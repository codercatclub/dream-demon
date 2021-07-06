import { Entity, System } from "../ecs/index";
import { FlickerC, PointLightC, Object3DC } from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { PointLight } from "three";
import { getComponent } from "./utils";

interface FlickerSystem extends System {
  entities: Entity[];
  nextFlickerTime: number;
  lights: PointLight[];
}

export const FlickerSystem: FlickerSystem = {
  type: "FlickerSystem",
  nextFlickerTime: 0,
  queries: [FlickerC],
  entities: [],
  lights: [],

  init: function (world) {
    this.entities = applyQuery(world.entities, this.queries);

    this.entities.forEach((ent, i) => {
      const { object3d } = getComponent(ent, Object3DC);

      object3d.traverse((obj) => {
        if (obj.type === "PointLight") {
          const light = obj as PointLight;
          light.userData["initIntensity"] = light.intensity;
          this.lights.push(light);
        }
      });
    });
  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], this.queries);
    this.entities = this.entities.concat(entities);
  },

  tick: function (time) {
    this.lights.forEach((light) => {
      let active = false;

      if (light) {
        if (time > this.nextFlickerTime) {
          active = Math.random() < 0.8;
          this.nextFlickerTime = time + 0.4 * Math.random();
        }
        light.intensity = active ? light.userData["initIntensity"] :light.userData["initIntensity"] - 0.4 * Math.random();
      }
    });
  },
};
