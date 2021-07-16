import { CamC, LinkTransformC, Object3DC, TransformC } from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { System } from "../ecs/index";
import { getComponent } from "./utils";
import { Object3D, Quaternion, Vector3, Vector4 } from "three";

interface LinkTransformSystem extends System {
  targets: TargetMap;
}

interface Target {
  obj: Object3D | undefined;
  pos: Vector3;
  rot: Quaternion;
  scale: Vector3;
}

type TargetMap = Map<number, Target>;

export const LinkTransformSystem: LinkTransformSystem = {
  type: "LinkTransformSystem",
  queries: [TransformC, LinkTransformC],
  targets: new Map(),

  init: function (world) {
    this.entities = applyQuery(world.entities, this.queries);

    this.entities?.forEach((ent) => {
      const { targetName } = getComponent(ent, LinkTransformC);

      const obj = world.scene?.getObjectByName(targetName);

      if (!obj) {
        console.warn(`Can not link transforms. Object "${targetName}" is not found in the scene.`);
      }

      this.targets.set(ent.id, {
        obj, 
        pos: new Vector3(),
        rot: new Quaternion(),
        scale: new Vector3(),
      });
    });
  },

  tick: function () {
    this.entities?.forEach((ent) => {
      const target = this.targets.get(ent.id);
  
      if (target) {
        target.obj?.matrixWorld.decompose(
          target.pos,
          target.rot,
          target.scale
        );
  
        const { object3d } = getComponent(ent, Object3DC);
        const { linkRot, linkPos } = getComponent(ent, LinkTransformC);
  
        if (linkPos) {
          object3d.position.copy(target.pos);
        }

        if (linkRot) {
          object3d.quaternion.copy(target.rot);
        }
      }
    });
  },
};
