import { System } from "../ecs/index";
import { TransformC, Object3DC, VineMaterialC } from "../ecs/components";
import { applyQuery, Entity, World } from "../ecs/index";
import { Mesh, UniformsUtils, MeshStandardMaterial } from "three";
import { getComponent } from './utils';
import { ScrollAnimationSystem } from "./ScrollAnimationSystem";

interface VineMaterialSystem extends System {
  world: World | null;
  processEntity: (ent: Entity) => void;
  materials: THREE.Shader[],
  growthT: number,
  isGrowing: boolean;
  updateUniforms: (time: number, timeDelta: number) => void;
}

export const VineMaterialSystem: VineMaterialSystem = {
  type: "VineMaterialSystem",
  world: null,
  growthT: 0,
  isGrowing: false,
  materials: [],
  queries: [TransformC, Object3DC, VineMaterialC],

  init: function (world) {
    this.world = world;
    this.entities = applyQuery(world.entities, this.queries);
    this.entities.forEach(this.processEntity.bind(this));
  },

  processEntity: function(ent) {
    if (!this.world) return;
    const { object3d: parent } = getComponent(ent, Object3DC);
    
    const uniforms = {
      timeMSec: { type: "f", value: 0 },
      growthT: { type: "f", value: 0 },
    };
    let materialOptions = {
    };
    
    //HACK
    const material = new MeshStandardMaterial(materialOptions);
    material.onBeforeCompile = (mshader) => {
      mshader.uniforms = UniformsUtils.merge([
        uniforms,
        mshader.uniforms,
      ]);
      mshader.vertexShader = require(`../shaders/VineVert.glsl`);
      mshader.fragmentShader =require(`../shaders/VineFrag.glsl`);
      this.materials.push(mshader);
    };

    parent?.traverse((obj) => {
      if (obj.type === "Mesh") {
        const o = (obj as Mesh);
        o.material = material;
        o.scale.set(0.16,0.16,0.16);
        o.rotation.set(0,Math.PI-0.25,0);
        o.position.set(0,-1.78,0.08);
      }
    });
  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], this.queries);
    entities.forEach(this.processEntity.bind(this));
  },

  updateUniforms: function (time, timeDelta) {
    const scrollAnimSystem = this.world?.getSystem<ScrollAnimationSystem>(ScrollAnimationSystem.type);
    let scrollTime = scrollAnimSystem?.scrollTime;
    if(!scrollTime) {
      scrollTime = 0;
    }
    let effectDuration = 3;
    let growthStartTime = 16;
    const growthT = Math.min(1, Math.max(0, scrollTime - growthStartTime) / effectDuration);

    this.materials.forEach((mat) => {
      mat.uniforms["timeMSec"].value = time;
      mat.uniforms["growthT"].value = 30.0 * Math.pow(growthT,5.0);;
    });
  },

  tick: function(time, timeDelta) {
    this.updateUniforms(time, timeDelta);
  }
};
