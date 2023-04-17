import { IValueObject } from '../../IValueObject';

export class Explanation implements IValueObject<string> {
  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
  }

  public static of(value: string): Explanation {
    return new Explanation(value);
  }

  public value(): string | '' {
    return this._value || '';
  }

  public isValid(): boolean {
    return this._value !== null && !!this._value.length;
  }
}
