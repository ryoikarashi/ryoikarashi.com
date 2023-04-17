export interface IDomain<T> {
  isValid(): boolean;
  toPlainObj(): T;
  toJson(): string;
}
