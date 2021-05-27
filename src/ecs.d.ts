import * as THREE from "three";
export interface Component {
    type: string;
    data: unknown;
}
export interface Entity {
    id: number;
    name: string;
    components: Map<string, unknown>;
}
export interface System {
    type: string;
    init(world: World): void;
    tick(time: number, delta: number): void;
    onFrameStart(time: number, delta: number): void;
    onFrameEnd(time: number, delta: number): void;
    onEntityRemove?(id: number): void;
}
export interface WorldLike {
    entities: Entity[];
    systems: System[];
    scene: THREE.Scene | null;
    activeCamera: THREE.Camera | null;
    init(): void;
    addEntity(entity: Entity): this;
    removeEntity(id: number): this;
    registerSystem(system: System): this;
}
export declare function newEntity(components: Component[], name?: string): Entity;
export declare const applyQuery: (entities: Entity[], queries: Component[]) => Entity[];
export declare class World implements WorldLike {
    entities: Entity[];
    systems: System[];
    activeCamera: null;
    scene: THREE.Scene;
    constructor();
    init(): void;
    addEntity(entity: Entity): this;
    removeEntity(id: number): this;
    registerSystem(system: System): this;
}
