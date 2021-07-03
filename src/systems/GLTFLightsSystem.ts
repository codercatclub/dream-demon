import { System } from "../ecs/index";
import {
  TransformC,
  Object3DC,
  GLTFLigthsC,
} from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { getComponent } from "./utils";
import { PointLight } from "three";

export interface GLTFLightsSystem extends System {

}

export const GLTFLightsSystem: GLTFLightsSystem = {
  type: "GLTFLightsSystem",
  queries: [TransformC, Object3DC, GLTFLigthsC],

  init: function (world) {
    this.entities = applyQuery(world.entities, this.queries);

    this.entities.forEach((ent) => {
      const { object3d } = getComponent(ent, Object3DC);

      object3d.traverse(obj => {
        if (obj.type === "PointLight") {
          const light = obj as PointLight;
          light.intensity /= 4*Math.PI;

          light.decay = 2;

          // Shadow
          light.castShadow = true;
          light.shadow.mapSize.width = 2048;
          light.shadow.mapSize.height = 2048;
          light.shadow.camera.near = 0.05;
          light.shadow.camera.far = 30;
          light.shadow.bias = -0.0001;
        }
      })
     
    });
  },
};
