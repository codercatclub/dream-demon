import * as THREE from "three";
import { Color, PerspectiveCamera } from "three";
import { System } from "../ecs/index";

interface RenderSystemConfig {
  enableShadows: boolean;
  fog: { enabled: boolean; color: Color; density: number };
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
  configure(props: Partial<RenderSystemConfig>): RenderSystem;
  setCamera(cam: PerspectiveCamera): void;
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
  fog: { enabled: false, color: new Color(1, 1, 1), density: 0.1 },

  configure: function ({ enableShadows, fog }) {
    if (enableShadows) this.enableShadows = enableShadows;
    if (fog) this.fog = fog;

    return this;
  },

  setCamera: function (cam) {
    // TODO (Kirill): Overriding render system default camera is not idel.
    // perhaps render system should search for existing camera...
    this.camera = cam;
  },

  init: function (world) {
    this.animation = this.animation.bind(this);
    this.clock = new THREE.Clock();

    this.systems = world.systems.filter((s) => s.type !== "RenderSystem");

    this.scene = world.scene;

    if (this.fog.enabled && this.scene) {
      this.scene.fog = new THREE.FogExp2(
        this.fog.color.getHex(),
        this.fog.density
      );
    }

    // TODO
    // Set default camera.
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
