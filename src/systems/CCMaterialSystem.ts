import { System } from "../ecs/index";
import { TransformC, Object3DC, CCMaterialC } from "../ecs/components";
import { applyQuery, Entity, World } from "../ecs/index";
import { UniformsUtils, Mesh, Color, MeshStandardMaterial } from "three";
import { getComponent } from "./utils";

interface CCMaterialSystem extends System {
  world: World | null;
  shaders: THREE.Shader[],
  processEntity: (ent: Entity) => void;
}

export const CCMaterialSystem: CCMaterialSystem = {
  type: "CCMaterialSystem",
  world: null,
  shaders: [],
  queries: [TransformC, Object3DC, CCMaterialC],

  init: function (world) {
    this.world = world;
    this.entities = applyQuery(world.entities, this.queries);
    this.entities.forEach(this.processEntity.bind(this));
  },

  processEntity: function (ent) {
    if (!this.world) return;
    const { color } = getComponent(ent, CCMaterialC);
    const { object3d: parent } = getComponent(ent, Object3DC);

    let materialOptions = {
      color: new Color(color),
    };

    const material = new MeshStandardMaterial(materialOptions);
    material.defines = {};

    parent?.traverse((obj) => {
      if (obj.type === "Mesh") {
        let mesh = obj as Mesh;
        let sMat = mesh.material as MeshStandardMaterial;
        if (sMat.map) {
          material.map = sMat.map;
        }
        if (sMat.metalnessMap) {
          material.metalnessMap = sMat.metalnessMap;
        }
        material.metalness = sMat.metalness;
        
        if (sMat.normalMap) {
          material.normalMap = sMat.normalMap;
        }
        if (sMat.roughnessMap) {
          material.roughnessMap = sMat.roughnessMap;
        }
        material.roughness = sMat.roughness;

        if (sMat.envMap) {
          material.envMap = sMat.envMap;
          material.envMapIntensity = sMat.envMapIntensity;
        }
        mesh.material = material.clone();
        let uniforms  = {
          timeMSec : {value : 0}
        }
        mesh.material.onBeforeCompile = (shader) => {
          shader.uniforms = UniformsUtils.merge([
            uniforms,
            shader.uniforms,
          ]);
          shader.vertexShader = require(`../shaders/CCBasicVert.glsl`);
          shader.fragmentShader = require(`../shaders/CCBasicFrag.glsl`);

          this.shaders.push(shader);
        };
      }
    });
  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], this.queries);
    entities.forEach(this.processEntity.bind(this));
  },

  tick: function(time, timeDelta) {
    this.shaders.forEach((shader) => {
      shader.uniforms["timeMSec"].value = time;
    });
  }
};
