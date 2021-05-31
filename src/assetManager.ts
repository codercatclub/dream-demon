import { Object3D } from "three";
import { getLoader, LoaderResult } from "./loaders";

const getFileExtension = (path: string) => path.split(".").pop();

export interface Asset {
  tag: string;
  src: string;
  obj: Object3D | null;
}

export class AssetManager {
  private _assets: Asset[] = [];

  public get assets() {
    return this._assets;
  }

  public addAsset(src: string, tag: string) {
    this._assets.push({ src, tag, obj: null });
    return this;
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

  public onLoadStart() {}
  public onItemLoadStart(_idx: number, _assets: Asset[]) {}
  public onItemLoadEnd(_idx: number, _assets: Asset[]) {}
  public onLoadEnd() {}
}
