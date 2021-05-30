import { LoadingManager, Object3D } from "three";
import { Loader, loaders } from "./loaders";

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
      console.log("[-] There was an error loading " + url);
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
    const promises = this._assets.map((asset) => {
      const extension = asset.src.split(".").pop();
      
      if (!extension) {
        console.log(
          "[-] Failed to extract extension form asset source path.",
          asset.src
        );
        return;
      }

      let loader: Loader | null = null;

      switch (extension) {
        case "glb":
          loader = loaders["glb"];
          break;

        case "fbx":
          loader = loaders["fbx"];
          break;
      }

      if (!loader) {
        console.log('[-] Unknown loader for asset type.', asset);
        return;
      }

      return loader(asset.src);
    });

    const models = await Promise.all(promises);

    models.forEach((m, i) => {
      if (m) {
        this._assets[i].obj = m;
      }
    });
  }
}
