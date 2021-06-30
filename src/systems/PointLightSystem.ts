import { System } from "../ecs/index";
import { PointLightC, TransformC, Object3DC } from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { PointLight, PointLightHelper } from "three";
import { getObject3d, getComponent } from "./utils";

export const PointLightSystem: System = {
  type: "PointLightSystem",
  queries: [TransformC, Object3DC, PointLightC],

  init: function (world) {
    this.entities = applyQuery(world.entities, this.queries);

    this.entities.forEach((ent) => {
      const { color, intensity, distance, showHelper, shadow } = getComponent(
        ent,
        PointLightC
      );
      const parent = getObject3d(ent, world);

      const light = new PointLight(color, intensity, distance, 2);

      if (shadow) {
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500;
        light.shadow.bias = -0.0001;
      }

      if (showHelper) {
        const sphereSize = 0.2;
        const pointLightHelper = new PointLightHelper(light, sphereSize);
        parent?.add(pointLightHelper);
      }

      parent?.add(light);
    });
  },
};
