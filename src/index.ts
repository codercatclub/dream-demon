import { CamC, PosC, RenderC } from "./components";
import { Object3DSystem } from "./systems/Object3DSystem";
import { MoveSystem } from "./systems/MoveSystem";
import { StatsSystem } from "./systems/StatsSystem";
import { RenderSystem } from "./systems/RenderSystem";
import { CameraSystem } from "./systems/CameraSystem";
import { OrbitControlsSystem } from "./systems/OrbitControlsSystem";
import { World, newEntity } from "./ecs";

const Person1 = newEntity(
  [{ ...PosC, data: { x: 0.3, y: 0, z: 0 } }, RenderC],
  "Cube"
);
// const Person2 = newEntity([{ ...PosC, data: { x: 0, y: 0.5, z: 0 } }, RenderC]);

const world = new World();

const idToRemove = [];

for (let i = 0; i < 100; i++) {
  const ent = newEntity([
    { ...PosC, data: { x: i / 10 - 1.3, y: i / 10, z: 0 } },
    RenderC,
  ]);
  if (i%2 === 0) {
    idToRemove.push(ent.id);
  }
  world.addEntity(ent);
}

// Test remove 
// setTimeout(() => {
//   idToRemove.forEach(id => {
//     world.removeEntity(id)
//   })
// }, 3000)

const mainCam = newEntity(
  [{ ...PosC, data: { x: 0, y: 0, z: 3 } }, CamC],
  "Camera"
);

world.addEntity(mainCam);

world
  .registerSystem(CameraSystem)
  .registerSystem(RenderSystem)
  .registerSystem(Object3DSystem)
  .registerSystem(MoveSystem)
  .registerSystem(StatsSystem)
  .registerSystem(OrbitControlsSystem);

world.init();
