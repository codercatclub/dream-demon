import * as THREE from "three";
import { LoadedAsset } from "./assetManager";

export interface Component<T> {
  type: string;
  data: T;
}

export interface Entity {
  id: number;
  name: string;
  components: Map<string, unknown>;
}

export interface System {
  type: string;
  queries: Component<unknown>[];
  entities?: Entity[];

  init(world: World): void;
  tick?(time: number, delta: number): void;
  onFrameStart?(time: number, delta: number): void;
  onFrameEnd?(time: number, delta: number): void;
  onEntityAdd?(ent: Entity): void;
  onEntityRemove?(id: number): void;
}

export interface WorldLike {
  init(): void;
  addEntity(entity: Entity): this;
  removeEntity(id: number): this;
  registerSystem(system: System): this;
}

const generateID = () =>
  Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

export const newEntity = (
  components: Component<unknown>[],
  name = ""
): Entity =>
  extend({ name, id: generateID(), components: new Map() }, components);

/** Extend givent Entity componets with provided components */
export const extend = (
  entity: Entity,
  components: Component<unknown>[]
): Entity => {
  const cmp = new Map(entity.components);

  components.forEach((c) => cmp.set(c.type, c.data));

  return { ...entity, components: cmp };
};

/** Helper function for creating a new component with optional new data */
export function newComponent<T>(
  comp: Component<T>,
  newData?: Partial<Component<T>["data"]>
): Component<T> {
  // NOTE (Kirill): Asuming that component data has no nested objects.
  // Am I doing deep copy right? Mb use JSON.parse(JSON.stringify(object))
  return { type: comp.type, data: { ...comp.data, ...newData } };
}

export const applyQuery = (
  entities: Entity[],
  queries: Component<unknown>[]
): Entity[] => {
  const filtered: Entity[] = [];

  for (let i = 0; i < entities.length; i++) {
    let pass = true;
    const entity = entities[i];

    for (let j = 0; j < queries.length; j++) {
      const componentType = queries[j].type;

      if (!entity.components.has(componentType)) {
        pass = false;
        break;
      }
    }

    if (pass) {
      filtered.push(entity);
    }
  }

  return filtered;
};

export class World implements WorldLike {
  private _assets: LoadedAsset = {
    animations: new Map(),
    objects: new Map(),
    textures: new Map(),
  };
  entities: Entity[];
  systems: System[];
  scene: THREE.Scene | null;

  constructor(assets?: LoadedAsset) {
    if (assets) {
      this._assets = assets;
    }

    this.entities = [];
    this.systems = [];
    this.scene = new THREE.Scene();
  }

  public get assets(): LoadedAsset {
    return this._assets;
  }

  init() {
    this.systems.forEach((s) => s.init(this));
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);

    this.systems.forEach((s) => (s.onEntityAdd ? s.onEntityAdd(entity) : null));

    return this;
  }

  removeEntity(id: number) {
    this.entities = this.entities.filter((ent) => ent.id !== id);
    // Notify all of the systems
    this.systems.forEach((s) =>
      s.onEntityRemove ? s.onEntityRemove(id) : null
    );

    return this;
  }

  registerSystem(system: System) {
    this.systems.push(system);
    return this;
  }

  destroy() {
    document.querySelector("#world")?.remove();
  }

  getSystem(type: string) {
    this.systems.filter((s) => s.type === type)[0];
  }
}
