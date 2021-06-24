import { Object3D, Texture, Group } from "three";
import { AssetType, getLoader, LoaderResult, loaders } from "./loaders";

const getFileExtension = (path: string) => path.split(".").pop() ?? "";
const isSupported = (ext: string): boolean =>
  Object.keys(loaders).includes(ext);

export interface Asset {
  type: AssetType;
  tag: string;
  src: string;
  obj: Object3D | Texture | null;
}

export class AssetManager {
  private _assets: Asset[] = [];

  public get assets() {
    return this._assets;
  }

  public addAsset(src: string, tag: string) {
    const extension = getFileExtension(src) as AssetType;

    if (!isSupported(extension)) {
      console.warn(`Asset type is not supported ${src}`);
      return this;
    }

    this._assets.push({ type: extension, src, tag, obj: null });

    return this;
  }

  public async load() {
    this.onLoadStart();

    // Initiate download for every asset and build a promise list
    const promises = this._assets.map((asset, idx) => {
      const loader = getLoader(asset.type);

      this.onItemLoadStart(idx, this._assets);

      return loader(asset.src);
    }, [] as LoaderResult<Group | Texture>[]);

    let idx = 0;

    for (const p of promises) {
      p.then(() => {
        this.onItemLoadEnd(idx, this._assets);
        idx++;
      });
    }

    const results = await Promise.allSettled(promises);

    // Store models that successfully loaded
    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        this._assets[i].obj = result.value;
      } else {
        const { responseURL, statusText } = result?.reason?.target;
        console.error(
          `Failed to load model ${responseURL}. Status: ${statusText}`
        );
      }
    });

    this.onLoadEnd();
  }

  public onLoadStart() {
    const event = new CustomEvent("on-load-start");
    window.dispatchEvent(event);
  }

  public onItemLoadStart(idx: number, assets: Asset[]) {
    const event = new CustomEvent("on-item-load-start", {
      detail: { idx, assets },
    });
    window.dispatchEvent(event);
  }

  public onItemLoadEnd(idx: number, assets: Asset[]) {
    const event = new CustomEvent("on-item-load-end", {
      detail: { idx, assets },
    });
    window.dispatchEvent(event);
  }

  public onLoadEnd() {
    const event = new CustomEvent("on-load-end");
    window.dispatchEvent(event);
  }
}
