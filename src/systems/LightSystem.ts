import { System } from "../ecs/index";
import { PointLightC, TransformC, Object3DC } from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { PointLight, HemisphereLight } from "three";
import { getObject3d, getComponent } from "./utils";

interface LightSystem extends System {
  initPos: typeof TransformC.data.position[];
}

export const LightSystem: LightSystem = {
  type: "LightSystem",
  initPos: [],
  entities: [],
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

      // TODO...
      const light2 = new HemisphereLight( 0xffffbb, 0x080820, 2 );
      parent?.add( light2 );

      parent?.add(light);
    });
  },
};
