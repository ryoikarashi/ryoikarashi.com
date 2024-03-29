import { type IValueObject } from '../../IValueObject';

export class Height implements IValueObject<number | null> {
  private readonly _value: number | null;

  constructor(value: number | null) {
    this._value = value;
  }

  public static of(value: number | null): Height {
    return new Height(value);
  }

  isValid(): boolean {
    return this._value !== null && this._value > 0;
  }

  value(): number {
    return this._value ?? 1200;
  }
}
