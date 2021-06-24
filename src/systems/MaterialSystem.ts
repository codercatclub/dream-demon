import { System } from "../ecs/index";
import { TransformC, Object3DC, MaterialC } from "../ecs/components";
import { applyQuery, Entity, World } from "../ecs/index";
import { ShaderMaterial, Mesh } from "three";
import { getObject3d, getComponent } from './utils';

interface MaterialSystem extends System {
  world: World | null;
  processEntity: (ent: Entity) => void;
  material: THREE.ShaderMaterial | null;
}

export const MaterialSystem: MaterialSystem = {
  type: "MaterialSystem",
  world: null,
  material: null,
  queries: [TransformC, Object3DC, MaterialC],

  init: function (world) {
    this.world = world;
    this.entities = applyQuery(world.entities, this.queries);
    this.entities.forEach(this.processEntity.bind(this));
  },

  processEntity: function(ent) {
    if (!this.world) return;
    const { shader, color1, color2 } = getComponent(ent, MaterialC);
    const parent = getObject3d(ent, this.world);

    const uniforms = {
      colorB: { type: "vec3", value: color1 },
      colorA: { type: "vec3", value: color2 },
      timeMSec: { type: "f", value: 0 },
    };

    const material = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: require(`../shaders/${shader}Vert.glsl`),
      fragmentShader: require(`../shaders/${shader}Frag.glsl`),
    });

    parent?.traverse((obj) => {
      if (obj.type === "Mesh") {
        (obj as Mesh).material = material;
      }
    });
    console.log(parent)
    this.material = material;    
  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], this.queries);
    entities.forEach(this.processEntity.bind(this));
  },

  tick: function(time) {
    if(this.material) {
      this.material.uniforms["timeMSec"].value = time;
    }
  }
};
