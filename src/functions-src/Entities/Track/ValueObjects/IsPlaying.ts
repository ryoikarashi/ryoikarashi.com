import { IValueObject } from '../../IValueObject';

export class IsPlaying implements IValueObject<boolean | null> {
    private readonly _value: boolean | null;

    constructor(value: boolean | null) {
        this._value = value;
    }

    public static of(value: boolean | null): IsPlaying {
        return new IsPlaying(value);
    }

    public value(): boolean {
        return !!this._value;
    }

    public isValid(): boolean {
        return this._value !== null;
    }
}
