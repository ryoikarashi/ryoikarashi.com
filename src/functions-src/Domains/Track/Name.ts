import {ValueObject} from "../ValueObject";

export class Name implements ValueObject<string | null> {
    private readonly _value: string | null;

    constructor(value: string | null) {
        this._value = value;
    }

    public static of(value: string | null): Name {
        return new Name(value);
    }

    public value(): string | '' {
        return this._value || '';
    }

    public isValid(): boolean {
        return this._value !== null && !!this._value.length;
    }
}
