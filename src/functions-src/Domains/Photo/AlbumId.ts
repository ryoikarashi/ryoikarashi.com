import {ValueObject} from "../ValueObject";

export class AlbumId implements ValueObject<string | null> {
    private readonly _value: string | null;

    constructor(value: string | null) {
        this._value = value;
    }

    public static of(value: string | null): AlbumId {
        return new AlbumId(value);
    }

    isValid(): boolean {
        return this._value !== null && !!this._value?.length;
    }

    value(): string | '' {
        return this._value || '';
    }
}
