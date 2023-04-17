export interface IValueObject<T> {
  value(): T;
  isValid(): boolean;
}
