import { System } from "../ecs";
import { PointLightC, TransformC, Object3DC } from "../components";
import { applyQuery } from "../ecs";
import { PointLight, HemisphereLight, PMREMGenerator } from "three";

interface LightSystem extends System {
  initPos: typeof TransformC.data.position[];
}

export const LightSystem: LightSystem = {
  type: "LightSystem",
  initPos: [],
  entities: [],

  init: function (world) {
    this.entities = applyQuery(world.entities, [
      TransformC,
      Object3DC,
      PointLightC,
    ]);

    this.entities.forEach((ent) => {
      const { id } = ent.components.get(
        Object3DC.type
      ) as typeof Object3DC.data;
      const { color, intensity, distance } = ent.components.get(
        PointLightC.type
      ) as typeof PointLightC.data;

      const parent = world.scene?.getObjectById(parseFloat(id));

      const light = new PointLight(color, intensity, distance);

      // TODO...
      const light2 = new HemisphereLight( 0xffffbb, 0x080820, 2 );
      parent?.add( light2 );

      parent?.add(light);
    });
  },
};
