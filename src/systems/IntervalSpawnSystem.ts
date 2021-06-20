import { newEntity, System, World, Entity } from "../ecs/index";
import { TransformC, IntervalSpawnerC, Object3DC } from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { Vector3 } from "three";

interface IntervalSpawnSystem extends System {
  world: World | null;
  entities: Entity[];
  lastTime: number;
  count: number;
}

export const IntervalSpawnSystem: IntervalSpawnSystem = {
  type: "MoveSystem",
  queries: [TransformC, Object3DC, IntervalSpawnerC],
  entities: [],
  world: null,
  lastTime: 0,
  count: 0,

  init: function (world) {
    this.world = world;
    this.entities = applyQuery(world.entities, this.queries);
  },

  tick: function (time) {
    if (time - this.lastTime > 0.2) {
      const i = this.count/10;
      this.entities.forEach((ent) => {
        const oldC = Array.from(ent.components, ([k, v]) => ({
          type: k,
          data: v,
        })).filter(c => c.type !== "TransformC");
  
        const newC = [
          ...oldC,
          {
            ...TransformC,
            data: { ...TransformC.data, position: new Vector3(Math.cos(i*2), Math.sin(i*2), -i/5) },
          },
        ];

        const spawnEntity = newEntity(newC);

        this.world?.addEntity(spawnEntity);
      });

      this.lastTime = time;
      this.count++;
    }
  },
};
