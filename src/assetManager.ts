import { Object3D, Texture, Group } from "three";
import { AssetType, getLoader, LoaderResult, loaders } from "./loaders";

const getFileExtension = (path: string) => path.split(".").pop() ?? '';
const extensionToType = (ext: string): AssetType | undefined => {
  if (Object.keys(loaders).includes(ext)) {
    return ext as AssetType;
  }
  return;
} 

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
    const ext = getFileExtension(src);
    const type = extensionToType(ext);
    if (type) {
      this._assets.push({ type, src, tag, obj: null });
    }
    return this;
  }

  public async load() {
    this.onLoadStart();

    const promises = this._assets.reduce((result, asset, idx) => {
      const loader = getLoader(asset.type);

      if (loader) {
        this.onItemLoadStart(idx, this._assets);
        return result.concat([loader(asset.src)]);
      }

      return result;
    }, [] as LoaderResult<Group | Texture>[]);

    let idx = 0;

    for (const p of promises) {
      p.then(() => {
        this.onItemLoadEnd(idx, this._assets);
        idx++;
      });
    }

    const models = await Promise.all(promises);

    models.forEach((m, i) => {
      if (m) {
        this._assets[i].obj = m;
      }
    });

    this.onLoadEnd();
  }

  public onLoadStart() {
    const event = new CustomEvent("on-load-start");
    window.dispatchEvent(event);
  }

  public onItemLoadStart(idx: number, assets: Asset[]) {
    const event = new CustomEvent("on-item-load-start", { detail: { idx, assets } });
    window.dispatchEvent(event);
  }

  public onItemLoadEnd(idx: number, assets: Asset[]) {
    const event = new CustomEvent("on-item-load-end", { detail: { idx, assets } });
    window.dispatchEvent(event);
  }
  
  public onLoadEnd() {
    const event = new CustomEvent("on-load-end");
    window.dispatchEvent(event);
  }
}
