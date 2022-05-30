import { IValueObject } from '../IValueObject';

export class Url implements IValueObject<string | null> {
    private readonly _value: string | null;

    constructor(value: string | null) {
        this._value = value;
    }

    public static of(value: string | null): Url {
        return new Url(value);
    }

    isValid(): boolean {
        return this._value !== null && !!this._value?.length;
    }

    value(): string | '' {
        return this._value || '';
    }
}
