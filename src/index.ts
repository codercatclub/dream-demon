import { CamC, TransformC, Object3DC, GeometryC } from "./components";
import { Object3DSystem } from "./systems/Object3DSystem";
import { MoveSystem } from "./systems/MoveSystem";
import { StatsSystem } from "./systems/StatsSystem";
import { RenderSystem } from "./systems/RenderSystem";
import { CameraSystem } from "./systems/CameraSystem";
import { OrbitControlsSystem } from "./systems/OrbitControlsSystem";
import { GeometrySystem } from "./systems/GeometrySystem";
import { World, newEntity } from "./ecs";

const Person1 = newEntity(
  [{ ...TransformC, data: { x: 0.3, y: 0, z: 0 } }, Object3DC],
  "Cube"
);
// const Person2 = newEntity([{ ...TransformC, data: { x: 0, y: 0.5, z: 0 } }, Object3DC]);

const world = new World();

const idToRemove = [];

for (let i = 0; i < 100; i++) {
  const ent = newEntity([
    {
      ...TransformC,
      data: {
        ...TransformC.data,
        position: { x: i / 10 - 1.3, y: i / 10, z: 0 },
        scale: { x: 1, y: i, z: 1 },
      },
    },
    { ...GeometryC, data: { type: i % 2 === 0 ? "Box" : "Sphere" } },
    Object3DC,
  ]);
  if (i % 2 === 0) {
    idToRemove.push(ent.id);
  }
  world.addEntity(ent);
}

// // Test remove
// setTimeout(() => {
//   idToRemove.forEach(id => {
//     world.removeEntity(id)
//   })
// }, 3000)

const mainCam = newEntity(
  [{ ...TransformC, data: { ...TransformC.data, position: { x: 0, y: 0, z: 3 } } }, CamC],
  "Camera"
);

// const chair = newEntity([GLTFModelC, TransformC, Object3DC])

world.addEntity(mainCam);

world
  .registerSystem(CameraSystem)
  .registerSystem(RenderSystem)
  .registerSystem(Object3DSystem)
  .registerSystem(GeometrySystem)
  .registerSystem(MoveSystem)
  .registerSystem(StatsSystem)
  .registerSystem(OrbitControlsSystem);

world.init();
