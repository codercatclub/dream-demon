import * as THREE from "three";
import { Object3D } from "three";
import { Asset } from "./assetManager";

export interface Component {
  type: string;
  data: unknown;
}

export interface Entity {
  id: number;
  name: string;
  components: Map<string, unknown>;
}

export interface System {
  type: string;
  entities: Entity[];

  init(world: World): void;
  tick?(time: number, delta: number): void;
  onFrameStart?(time: number, delta: number): void;
  onFrameEnd?(time: number, delta: number): void;
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

export const newEntity = (components: Component[], name = ""): Entity =>
  extend({ name, id: generateID(), components: new Map() }, components);

export const extend = (entity: Entity, components: Component[]): Entity => {
  const cmp = new Map(entity.components);

  components.forEach((c) => cmp.set(c.type, c.data));

  return { ...entity, components: cmp };
};

export const applyQuery = (
  entities: Entity[],
  queries: Component[]
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

type AssetMap = Map<string, Object3D>;

export class World implements WorldLike {
  private _assets: AssetMap;
  entities: Entity[];
  systems: System[];
  scene: THREE.Scene | null;
  activeCamera: THREE.PerspectiveCamera | null;

  constructor(assets: Asset[]) {
    this._assets = new Map();

    assets.forEach(a => {
      if (a.obj) {
        this._assets.set(a.src, a.obj);
      }
    })

    this.entities = [];
    this.systems = [];
    this.scene = new THREE.Scene();
    this.activeCamera = null;
  }

  public get assets(): AssetMap {
    return this._assets;
  }

  init() {
    this.systems.forEach((s) => s.init(this));
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
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
}
