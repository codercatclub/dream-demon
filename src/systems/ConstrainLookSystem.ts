import { System } from "../ecs/index";
import { TransformC, Object3DC, GLTFCameraC } from "../ecs/components";
import { applyQuery } from "../ecs/index";
import { getComponent } from "./utils";
import { Quaternion, Vector3, PerspectiveCamera, AnimationMixer } from "three";
import { RenderSystem } from "./RenderSystem";

const X_MOVE_SPEED = 0.0002;
const Y_MOVE_SPEED = 0.0002;
const DAMP = 0.9;
const X_ROT_CLAMP = 0.2;
const Y_ROT_CLAMP = 0.3;
const CLAMP_BACK_LERP = 0.5;

export interface ConstraintLookSystem extends System {
  mixer: AnimationMixer | null;
  camera: PerspectiveCamera | null;
  movementParams: any;
  updateMouseRotation: () => void;
}

export const ConstraintLookSystem: ConstraintLookSystem = {
  type: "ConstraintLookSystem",
  queries: [TransformC, Object3DC, GLTFCameraC],
  mixer: null,
  camera: null,
  movementParams: {},

  init: function (world) {
    this.entities = applyQuery(world.entities, this.queries);

    this.movementParams["rotYVelo"] = 0;
    this.movementParams["rotXVelo"] = 0;
    this.movementParams["totalYRot"] = 0;
    this.movementParams["totalXRot"] = 0;

    window.addEventListener("mousemove", (event) => {
      this.movementParams["rotYVelo"] -= X_MOVE_SPEED * event.movementX;
      this.movementParams["rotXVelo"] -= Y_MOVE_SPEED * event.movementY;
    });

    this.entities.forEach((ent) => {
      const { object3d } = getComponent(ent, Object3DC);

      const cam = object3d.getObjectByProperty(
        "type",
        "PerspectiveCamera"
      ) as PerspectiveCamera;

      // Set aspect ratio based on window size
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();

      const renderSystem = world.getSystem<RenderSystem>(RenderSystem.type);
      renderSystem?.setCamera(cam);

      this.camera = cam;
      this.movementParams["originalRot"] = this.camera.quaternion.clone();
    });
  },

  updateMouseRotation: function () {
    if (!this.camera) return;
    //update Y
    this.movementParams["rotYVelo"] *= DAMP; // damp
    this.movementParams["totalYRot"] += this.movementParams["rotYVelo"];

    if (this.movementParams["totalYRot"] > Y_ROT_CLAMP) {
      this.movementParams["totalYRot"] =
        CLAMP_BACK_LERP * this.movementParams["totalYRot"] +
        (1.0 - CLAMP_BACK_LERP) * Y_ROT_CLAMP;
    }
    if (this.movementParams["totalYRot"] < -Y_ROT_CLAMP) {
      this.movementParams["totalYRot"] =
        CLAMP_BACK_LERP * this.movementParams["totalYRot"] +
        (1.0 - CLAMP_BACK_LERP) * -Y_ROT_CLAMP;
    }

    //update X
    this.movementParams["rotXVelo"] *= DAMP; // damp
    this.movementParams["totalXRot"] += this.movementParams["rotXVelo"];

    if (this.movementParams["totalXRot"] > X_ROT_CLAMP) {
      this.movementParams["totalXRot"] =
        CLAMP_BACK_LERP * this.movementParams["totalXRot"] +
        (1.0 - CLAMP_BACK_LERP) * X_ROT_CLAMP;
    }
    if (this.movementParams["totalXRot"] < -X_ROT_CLAMP) {
      this.movementParams["totalXRot"] =
        CLAMP_BACK_LERP * this.movementParams["totalXRot"] +
        (1.0 - CLAMP_BACK_LERP) * -X_ROT_CLAMP;
    }

    let yrot = this.movementParams["totalYRot"];
    let xrot = this.movementParams["totalXRot"];

    //apply movement based on mouse movement delta
    let q = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), yrot);
    q.multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), xrot));
    this.camera.setRotationFromQuaternion(
      this.movementParams["originalRot"].clone().multiply(q)
    );
  },

  tick: function (_time, deltaTime) {
    if (this.mixer) this.mixer.update(deltaTime);
    this.updateMouseRotation();
  },
};
