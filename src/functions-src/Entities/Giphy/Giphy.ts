import { IDomain } from '../IDomain';
import { Src } from './ValueObjects';

export interface GiphyPlainObj {
    src: string;
}

export class Giphy implements IDomain<GiphyPlainObj> {
    private readonly _src: Src;

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
