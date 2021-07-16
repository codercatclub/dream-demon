import { System } from "../ecs/index";
import { TransformC, Object3DC, VoidMaterialC } from "../ecs/components";
import { applyQuery, Entity, World } from "../ecs/index";
import { Mesh, SkinnedMesh, UniformsUtils, MeshStandardMaterial, MaterialLoader } from "three";
import { getComponent } from './utils';
import { ScrollAnimationSystem } from "./ScrollAnimationSystem";

interface VoidMaterialSystem extends System {
  world: World | null;
  processEntity: (ent: Entity) => void;
  materials: THREE.Shader[],
  growthT: number,
  isGrowing: boolean;
  updateUniforms: (time: number, timeDelta: number) => void;
}

export const VoidMaterialSystem: VoidMaterialSystem = {
  type: "VoidMaterialSystem",
  world: null,
  growthT: 0,
  isGrowing: false,
  materials: [],
  queries: [TransformC, Object3DC, VoidMaterialC],

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
      transparent: true,
    };
    
    //HACK
    const material = new MeshStandardMaterial(materialOptions);
    material.onBeforeCompile = (mshader) => {
      mshader.uniforms = UniformsUtils.merge([
        uniforms,
        mshader.uniforms,
      ]);
      mshader.vertexShader = require(`../shaders/VoidVert.glsl`);
      mshader.fragmentShader =require(`../shaders/VoidFrag.glsl`);
      this.materials.push(mshader);
    };

    parent?.traverse((obj) => {
      if (obj.type === "SkinnedMesh") {
        const o = (obj as SkinnedMesh);
        let sMat = o.material as MeshStandardMaterial;
        material.map = sMat.map;
        o.material = material;
        material.skinning = true;
      }
      if (obj.type === "Mesh") {
        const o = (obj as Mesh);
        o.material = material;
      }
    });
  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], this.queries);
    entities.forEach(this.processEntity.bind(this));
  },

  updateUniforms: function (time) {
    const scrollAnimSystem = this.world?.getSystem<ScrollAnimationSystem>(ScrollAnimationSystem.type);
    let scrollTime = scrollAnimSystem?.scrollTime;
    if(!scrollTime) {
      scrollTime = 0;
    }
    let effectDuration = 4;
    let growthStartTime = 10.56;
    const growthT = Math.min(1, Math.max(0, scrollTime - growthStartTime) / effectDuration);
    this.materials.forEach((mat) => {
      mat.uniforms["timeMSec"].value = time;
      mat.uniforms["growthT"].value = growthT;
    });
  },

  tick: function(time, timeDelta) {
    this.updateUniforms(time, timeDelta);
  }
};
