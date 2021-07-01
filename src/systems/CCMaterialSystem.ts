import { System } from "../ecs/index";
import { TransformC, Object3DC, CCMaterialC } from "../ecs/components";
import { applyQuery, Entity, World } from "../ecs/index";
import { Mesh, MeshPhongMaterial, Color, MeshStandardMaterial } from "three";
import { getObject3d, getComponent } from './utils';

interface CCMaterialSystem extends System {
  world: World | null;
  processEntity: (ent: Entity) => void;
}

export const CCMaterialSystem: CCMaterialSystem = {
  type: "CCMaterialSystem",
  world: null,
  queries: [TransformC, Object3DC, CCMaterialC],

  init: function (world) {
    this.world = world;
    this.entities = applyQuery(world.entities, this.queries);
    this.entities.forEach(this.processEntity.bind(this));
  },

  processEntity: function(ent) {
    if (!this.world) return;
    const {color} = getComponent(ent, CCMaterialC);
    const parent = getObject3d(ent, this.world);

    let materialOptions = {
      color: new Color(color),
    };

    const material = new MeshStandardMaterial(materialOptions);
    material.defines = {};

    parent?.traverse((obj) => {
      if (obj.type === "Mesh") {
        let mesh = (obj as Mesh);
        let sMat = (mesh.material as MeshStandardMaterial);
        if(sMat.map) {
          material.map = sMat.map;
        }
        if(sMat.normalMap) {
          material.normalMap = sMat.normalMap;
        }
        if(sMat.roughnessMap) {
          material.roughnessMap = sMat.roughnessMap;
        }
        if(sMat.envMap) {
          material.envMap = sMat.envMap;
          material.envMapIntensity = sMat.envMapIntensity;
        }
        mesh.material = material.clone();
        mesh.material.onBeforeCompile = (shader) => {
          // shader.uniforms = UniformsUtils.merge([
          //   this.uniforms,
          //   shader.uniforms,
          // ]);
          shader.vertexShader = require(`../shaders/CCBasicVert.glsl`);
          shader.fragmentShader = require(`../shaders/CCBasicFrag.glsl`);
        };
      }
    });
  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], this.queries);
    entities.forEach(this.processEntity.bind(this));
  }
};