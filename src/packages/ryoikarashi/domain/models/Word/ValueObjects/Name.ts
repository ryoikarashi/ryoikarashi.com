import { type IValueObject } from '../../IValueObject';

export class Name implements IValueObject<string | null> {
  private readonly _value: string | null;

  constructor(value: string | null) {
    this._value = value;
  }

  public static of(value: string | null): Name {
    return new Name(value);
  }

  isValid(): boolean {
    return this._value !== null && this._value.length > 0;
  }

  value(): string {
    return this._value ?? '';
  }
}
