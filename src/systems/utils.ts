import { Object3DC } from "../ecs/components";
import { Entity, World } from "../ecs/index";
import { Object3D } from "three";

export interface Component<T> { type: string; data: T };

/** Get component from an Entity */
export function getComponent<T> (ent: Entity, comp: Component<T>): (Component<T>['data']) {
  // TODO (Kirill): Map.get can potentialy return undefined. For now we assume entity alway has requested component.
  return ent.components.get(
    comp.type
  ) as typeof comp.data;
}

export const getObject3d = (ent: Entity, world: World): Object3D | undefined => {
  const { id } = ent.components.get(Object3DC.type) as typeof Object3DC.data;
  return world.scene?.getObjectById(parseFloat(id));
};