import { IDomain } from '../IDomain';
import { Url } from './Url';
import { Width } from './Width';
import { Height } from './Height';

export interface PhotoPlainObj {
    width: string;
    height: string;
    url: string;
}

export class Photo implements IDomain<PhotoPlainObj> {
    private readonly _url: Url;
    private readonly _width: Width;
    private readonly _height: Height;

    constructor(url: Url, width: Width, height: Height) {
        this._url = url;
        this._width = width;
        this._height = height;
    }

    public get url(): Url {
        return this._url;
    }

    public get width(): Width {
        return this._width;
    }

    public get height(): Height {
        return this._height;
    }

    isValid(): boolean {
        return this._url.isValid() && this._width.isValid() && this._height.isValid();
    }

    toPlainObj(): PhotoPlainObj {
        return {
            width: this._width.value(),
            height: this._height.value(),
            url: this._url.value(),
        };
    }

    toJson(): string {
        return JSON.stringify(this.toPlainObj());
    }
}
