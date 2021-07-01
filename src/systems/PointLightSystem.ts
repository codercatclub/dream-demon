import { System } from "../ecs/index";
import { PointLightC, TransformC, Object3DC } from "../ecs/components";
import { applyQuery } from "../ecs/index";
import {
  PointLight,
  SphereGeometry,
  WireframeGeometry,
  LineSegments,
  MeshStandardMaterial,
} from "three";
import { getComponent } from "./utils";

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
      const { object3d: parent } = getComponent(ent, Object3DC);

      const light = new PointLight(color, intensity, distance, 2);

      if (shadow) {
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.05;
        light.shadow.camera.far = 30;
        light.shadow.bias = -0.0001;
      }

      if (showHelper) {
        const geometry = new SphereGeometry(0.2, 0.2, 0.2);

        const wireframe = new WireframeGeometry(geometry);

        const line = new LineSegments(wireframe);

        (line.material as MeshStandardMaterial).depthTest = false;
        (line.material as MeshStandardMaterial).opacity = 0.5;
        (line.material as MeshStandardMaterial).transparent = true;

        parent?.add(line);
      }

      parent?.add(light);
    });
  },
};
