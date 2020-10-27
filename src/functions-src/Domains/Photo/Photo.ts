import {IDomain} from "../IDomain";
import {Url} from "./Url";

export interface PhotoPlainObj {
    url: string;
}

export class Photo implements IDomain<PhotoPlainObj> {
    private readonly _url: Url;

    constructor(url: Url) {
        this._url = url;
    }

    public get getUrl(): Url {
        return this._url;
    }

    isValid(): boolean {
        return this._url.isValid();
    }

    toPlainObj(): PhotoPlainObj {
        return {
            url: this._url.value(),
        };
    }

    toJson(): string {
        return JSON.stringify(this.toPlainObj());
    }
}
