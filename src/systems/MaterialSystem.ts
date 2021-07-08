import { System } from "../ecs/index";
import { TransformC, Object3DC, MaterialC } from "../ecs/components";
import { applyQuery, Entity, World } from "../ecs/index";
import { SkinnedMesh, Mesh, UniformsUtils, MeshPhongMaterial, MeshStandardMaterial } from "three";
import { getComponent } from './utils';
import { TimelineSystem, TimelineSytem } from "./TimelineSystem";

interface MaterialSystem extends System {
  world: World | null;
  processEntity: (ent: Entity) => void;
  materials: THREE.Shader[],
  growthT: number,
  isGrowing: boolean;
  dissolveT: number;
  isDissolving: boolean;
  updateUniforms: (time: number, timeDelta: number) => void;
}

export const MaterialSystem: MaterialSystem = {
  type: "MaterialSystem",
  world: null,
  growthT: 0,
  dissolveT: 0,
  isGrowing: false,
  isDissolving: false,
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
    const { object3d: parent } = getComponent(ent, Object3DC);
    
    const uniforms = {
      colorB: { type: "vec3", value: color1 },
      colorA: { type: "vec3", value: color2 },
      timeMSec: { type: "f", value: 0 },
      growthT: { type: "f", value: 0 },
      dissolveT: { type: "f", value: 0 },
    };
    let materialOptions = {
    };
    
    //HACK
    const material = shader == "Vine" ? new MeshStandardMaterial(materialOptions) : new MeshPhongMaterial(materialOptions);
    material.onBeforeCompile = (mshader) => {
      mshader.uniforms = UniformsUtils.merge([
        uniforms,
        mshader.uniforms,
      ]);
      mshader.vertexShader = require(`../shaders/${shader}Vert.glsl`);
      mshader.fragmentShader =require(`../shaders/${shader}Frag.glsl`);
      this.materials.push(mshader);
    };

    parent?.traverse((obj) => {
      if (obj.type === "Mesh") {
        (obj as Mesh).material = material;
      }
      if (obj.type === "SkinnedMesh") {
        (obj as SkinnedMesh).material = material;
        material.skinning = true;
      }
    });

    //onkeypress, fade in 
    window.addEventListener("keydown", (event) => {
      if(event.key == "p") {
        this.isDissolving = true;
        this.growthT = 0;
        this.dissolveT = 0;
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
      if(this.isDissolving) {
        this.dissolveT += 0.1*timeDelta;
        if(this.dissolveT > 1) {
          this.isDissolving = false;
          this.isGrowing = true;
        }
        mat.uniforms["dissolveT"].value = this.dissolveT;
        mat.uniforms["growthT"].value = 0;
      } 
      if(this.isGrowing) {
        this.growthT += 0.1*timeDelta;
        if(this.growthT > 1) {
          this.isGrowing = false;
        }
        mat.uniforms["growthT"].value =30.0 * Math.pow(this.growthT,5.0);
      }
    });
  },

  tick: function(time, timeDelta) {
    this.updateUniforms(time, timeDelta);
  }
};
