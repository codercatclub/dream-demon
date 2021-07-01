import { Entity } from "../ecs/index";

export interface Component<T> { type: string; data: T };

/** Get component from an Entity */
export function getComponent<T> (ent: Entity, comp: Component<T>): (Component<T>['data']) {
  // TODO (Kirill): Map.get can potentialy return undefined. For now we assume entity alway has requested component.
  return ent.components.get(
    comp.type
  ) as typeof comp.data;
}
