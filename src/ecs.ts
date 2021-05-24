import * as THREE from "three";

const generateID = () =>
  Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));

export const newEntity = (components, name = "") => {
  const cmp = new Map();
  const id = generateID();

  components.forEach((c) => cmp.set(c.type, c.data));

  const ent = { name, id, components: cmp };

  return ent;
};

export const applyQuery = (entities, queries) => {
  const filtered = [];

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

export class World {
  private entities;
  private systems;
  scene = null;
  activeCamera = null;

  constructor() {
    this.entities = [];
    this.systems = [];
    this.scene = new THREE.Scene();
  }

  addEntity(entity) {
    this.entities.push(entity);
    return this;
  }

  removeEntity(id) {
    this.entities = this.entities.filter((ent) => ent.id !== id);
    // Notify all of the systems
    this.systems.forEach((s) => s.onEntityRemove ? s.onEntityRemove(id) : null);
  }

  registerSystem(system) {
    this.systems.push(system);
    return this;
  }

  init() {
    this.systems.forEach((s) => s.init(this));
  }
}
