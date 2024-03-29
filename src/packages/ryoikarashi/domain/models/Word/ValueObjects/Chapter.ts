import { type IValueObject } from '../../IValueObject';

export class Chapter implements IValueObject<string | null> {
  private readonly _value: string | null;

  constructor(value: string | null) {
    this._value = value;
  }

  public static of(value: string | null): Chapter {
    return new Chapter(value);
  }

  isValid(): boolean {
    return this._value !== null && this._value.length > 0;
  }

  value(): string {
    return this._value ?? '';
  }
}
