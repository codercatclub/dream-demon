import { System } from "../ecs";
import { TransformC, Object3DC, MaterialC } from "../components";
import { applyQuery, Entity, World } from "../ecs";
import { ShaderMaterial, Color, Mesh, Object3D } from "three";

// @ts-ignore
import CCBasicVert from "../shaders/CCBasicVert.glsl";
// @ts-ignore
import CCBasicFrag from "../shaders/CCBasicFrag.glsl";

const getObject3d = (ent: Entity, world: World): Object3D | undefined => {
  const { id } = ent.components.get(Object3DC.type) as typeof Object3DC.data;
  return world.scene?.getObjectById(parseFloat(id));
};

interface MaterialSystem extends System {
  world: World;
  processEntity: (ent: Entity) => void;
}

export const MaterialSystem: MaterialSystem = {
  type: "MaterialSystem",
  queries: [TransformC, Object3DC, MaterialC],
  entities: [],

  init: function (world) {
    this.world = world;
    this.entities = applyQuery(world.entities, this.queries);
    this.entities.forEach(this.processEntity.bind(this));
  },

  processEntity: function(ent) {
    if (!this.world) return;
  
    const parent = getObject3d(ent, this.world);

    const uniforms = {
      colorB: { type: "vec3", value: new Color(0xacb6e5) },
      colorA: { type: "vec3", value: new Color(0x74ebd5) },
    };

    const material = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: CCBasicVert,
      fragmentShader: CCBasicFrag,
    });

    parent?.traverse((obj) => {
      if (obj.type === "Mesh") {
        (obj as Mesh).material = material;
      }
    });
  },

  onEntityAdd: function (ent) {
    const entities = applyQuery([ent], this.queries);
    entities.forEach(this.processEntity.bind(this));
  }
};
