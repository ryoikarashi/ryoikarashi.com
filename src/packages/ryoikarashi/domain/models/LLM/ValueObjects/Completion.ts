import { type IValueObject } from '../../IValueObject';

export class Completion implements IValueObject<string> {
  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
  }

  public static of(value: string): Completion {
    return new Completion(value);
  }

  public value(): string {
    return this._value;
  }

  public isValid(): boolean {
    return this._value.length > 0;
  }
}
