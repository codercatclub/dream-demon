import * as THREE from "three";
import { System } from "../ecs/index";

interface RenderSystemConfig {
  enableShadows: boolean;
}

export interface RenderSystem extends System, RenderSystemConfig {
  camera: THREE.PerspectiveCamera | null;
  scene: THREE.Scene | null;
  renderer: THREE.WebGLRenderer | null;
  clock: THREE.Clock | null;
  systems: System[];
  animation(time: number): void;
  onFrameStart(time: number, delta: number): void;
  onFrameEnd(time: number, delta: number): void;
  tick(time: number, delta: number): void;
  onWindowResize(): void;
  configure(props: RenderSystemConfig): RenderSystem;
}

export const RenderSystem: RenderSystem = {
  type: "RenderSystem",
  camera: null,
  scene: null,
  renderer: null,
  systems: [],
  clock: null,
  queries: [],
  enableShadows: false,

  configure: function ({ enableShadows }) {
    if (enableShadows) {
      this.enableShadows = enableShadows;
    }

    return this;
  },

  init: function (world) {
    this.animation = this.animation.bind(this);
    this.clock = new THREE.Clock();

    this.systems = world.systems.filter((s) => s.type !== "RenderSystem");

    this.scene = world.scene;

    if (this.scene) {
      this.scene.fog = new THREE.FogExp2(0xc2d1d1, 0.08);
    }

    // TODO
    // Set default camera. Can be overriden by render system
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );

    this.camera.position.set(0, 0, 1);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.animation);

    this.renderer.domElement.id = "world";

    if (this.enableShadows) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    document.body.appendChild(this.renderer.domElement);

    // TODO (Kirill): Remove resize event listener on world.destroy
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  },

  animation: function () {
    if (!this.clock || !this.scene || !this.camera || !this.renderer) return;

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.elapsedTime;

    this.onFrameStart(elapsedTime, delta);

    this.tick(elapsedTime, delta);

    this.renderer.render(this.scene, this.camera);

    this.onFrameEnd(elapsedTime, delta);
  },

  onWindowResize: function () {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  },

  onFrameStart: function (time, delta) {
    this.systems.forEach((s) =>
      s.onFrameStart ? s.onFrameStart(time, delta) : null
    );
  },

  onFrameEnd: function (time, delta) {
    this.systems.forEach((s) =>
      s.onFrameEnd ? s.onFrameEnd(time, delta) : null
    );
  },

  tick: function (time, delta) {
    this.systems.forEach((s) => (s.tick ? s.tick(time, delta) : null));
  },
};
