import { System } from "../ecs/index";
import { TransformC, Object3DC, MaterialC } from "../ecs/components";
import { applyQuery, Entity, World } from "../ecs/index";
import { ShaderMaterial, Mesh } from "three";
import { getObject3d, getComponent } from './utils';

interface MaterialSystem extends System {
  world: World | null;
  processEntity: (ent: Entity) => void;
  materials: THREE.ShaderMaterial[],
  growthT: number,
  isGrowing: boolean;
  updateUniforms: (time: number, timeDelta: number) => void;
}

export const MaterialSystem: MaterialSystem = {
  type: "MaterialSystem",
  world: null,
  growthT: 0,
  isGrowing: false,
  materials: [],
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
      growthT: { type: "f", value: 0.75 },
    };

    const material = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: require(`../shaders/${shader}Vert.glsl`),
      fragmentShader: require(`../shaders/${shader}Frag.glsl`),
    });

    this.materials.push(material);
    parent?.traverse((obj) => {
      if (obj.type === "Mesh") {
        (obj as Mesh).material = material;
      }
    });
    //onkeypress, fade in 
    window.addEventListener("keydown", (event) => {
      if(event.key == "p") {
        this.isGrowing = true;
        this.growthT = 0;
      }
    })

  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], this.queries);
    entities.forEach(this.processEntity.bind(this));
  },

  updateUniforms: function (time, timeDelta) {
    this.materials.forEach((mat) => {
      mat.uniforms["timeMSec"].value = time;
      if(this.isGrowing) {
        this.growthT += 0.1*timeDelta;
        if(this.growthT > 1) {
          this.isGrowing = false;
        }
        mat.uniforms["growthT"].value =0.75 + 30.0 * Math.pow(this.growthT,5.0);
      }
    });
  },

  tick: function(time, timeDelta) {
    this.updateUniforms(time, timeDelta);
  }
};
