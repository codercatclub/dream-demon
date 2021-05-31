import { DefaultLoadingManager, Object3D } from "three";
import { getLoader, LoaderResult } from "./loaders";

const getFileExtension = (path: string) => path.split(".").pop();

export interface Asset {
  tag: string;
  src: string;
  obj: Object3D | null;
}

export class AssetManager {
  private _assets: Asset[] = [];
  private _manager;

  constructor() {
    this._manager = DefaultLoadingManager;

    // this._manager.onStart = function (url, itemsLoaded, itemsTotal) {
    //   console.log("[D] Loading started. Total items:",itemsTotal);
    // };

    // this._manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    //   console.log("[D] Loading progress", url, itemsLoaded, itemsTotal);
    // };

    // this._manager.itemStart = function (url) {
    //   console.log("[D] Start loading", url);
    // };

    // this._manager.itemEnd = function (url) {
    //   console.log("[D] Ended loading", url);
    // };

    // this._manager.onLoad = function () {
    //   console.log("[D] Loading complete!");
    // };

    // this._manager.onError = function (url) {
    //   console.log("[-] There was an error loading " + url);
    // };
  }

  public get assets() {
    return this._assets;
  }

  public addAsset(src: string, tag: string) {
    this._assets.push({ src, tag, obj: null });
    return this;
  }

  public onLoadStart() {
    console.log("[D] Starting loading assets!");
  }

  public onItemLoadStart(idx: number, assets: Asset[]) {
    console.log("[D] Start: ", idx, assets[idx].src);
  }

  public onItemLoadFinish(idx: number, assets: Asset[]) {
    console.log("[D] Finish: ", idx, assets[idx].src);
  }

  public onLoadFinish() {
    console.log("[D] Finish loading all assets!");
  }

  public async load() {
    this.onLoadStart();

    const promises = this._assets.reduce((result, asset, idx) => {
      const ext = getFileExtension(asset.src);

      if (!ext) {
        console.log(
          "[-] Failed to extract extension form asset source path.",
          asset.src
        );
        return result;
      }

      const loader = getLoader(ext);

      if (loader) {
        this.onItemLoadStart(idx, this._assets);
        return result.concat([loader(asset.src)]);
      }

      return result;
    }, [] as LoaderResult[]);

    let idx = 0;

    for (const p of promises) {
      p.then(() => {
        this.onItemLoadFinish(idx, this._assets);
        idx++;
      });
    }

    const models = await Promise.all(promises);

    models.forEach((m, i) => {
      if (m) {
        this._assets[i].obj = m;
      }
    });

    this.onLoadFinish();
  }
}

