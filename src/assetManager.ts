import { LoadingManager, Object3D } from "three";
import { loadGLTF } from "./loaders";

export interface Asset {
  tag: string;
  src: string;
  obj: Object3D | null;
}

export class AssetManager {
  private _assets: Asset[] = [];
  private _manager;

  constructor() {
    this._manager = new LoadingManager();

    this._manager.onStart = function (url, itemsLoaded, itemsTotal) {
      console.log(
        "Started loading file: " +
          url +
          ".\nLoaded " +
          itemsLoaded +
          " of " +
          itemsTotal +
          " files."
      );
    };

    this._manager.onLoad = function () {
      console.log("Loading complete!");
    };

    this._manager.onProgress = function (url, itemsLoaded, itemsTotal) {
      console.log(
        "Loading file: " +
          url +
          ".\nLoaded " +
          itemsLoaded +
          " of " +
          itemsTotal +
          " files."
      );
    };

    this._manager.onError = function (url) {
      console.log("There was an error loading " + url);
    };
  }

  public get assets() {
    return this._assets;
  }

  public addAsset(src: string, tag: string) {
    this._assets.push({ src, tag, obj: null });
    return this;
  }

  public async load() {
    const promises = this._assets.map((asset) => loadGLTF(asset.src));

    const models = await Promise.all(promises);

    models.forEach((m, i) => {
      this._assets[i].obj = m.scene;
    });
  }
}
