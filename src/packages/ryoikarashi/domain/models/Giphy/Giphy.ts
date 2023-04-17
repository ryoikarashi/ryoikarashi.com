import { IDomain } from '../IDomain';
import { Src } from './ValueObjects';

const test = true;

export interface GiphyPlainObj {
  src: string;
}

export class Giphy implements IDomain<GiphyPlainObj> {
  private readonly _src: Src;

  public static DEFAULT_PLAIN_OBJ: GiphyPlainObj = {
    src: '',
  };

  constructor(src: Src) {
    this._src = src;
  }

  public get src(): Src {
    return this._src;
  }

  isValid(): boolean {
    return this._src.isValid();
  }

  toPlainObj(): GiphyPlainObj {
    return {
      src: this._src.value(),
    };
  }

  toJson(): string {
    return JSON.stringify(this.toPlainObj());
  }
}
