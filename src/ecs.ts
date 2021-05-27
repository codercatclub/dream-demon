import * as THREE from "three";

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

export function newEntity (components: Component[], name = ""): Entity {
  const cmp: Map<string, unknown> = new Map();
  const id = generateID();

  components.forEach((c) => cmp.set(c.type, c.data));

  const ent = { name, id, components: cmp };

  return ent;
};

export const applyQuery = (entities: Entity[], queries: Component[]): Entity[] => {
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
  entities: Entity[];
  systems: System[]; 
  scene: THREE.Scene | null;
  activeCamera: THREE.PerspectiveCamera | null;

  constructor() {
    this.entities = [];
    this.systems = [];
    this.scene = new THREE.Scene();
    this.activeCamera = null;
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
    this.systems.forEach((s) => s.onEntityRemove ? s.onEntityRemove(id) : null);
    return this;
  }

  registerSystem(system: System) {
    this.systems.push(system);
    return this;
  }
}
