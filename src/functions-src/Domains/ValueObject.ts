export interface ValueObject<T> {
    value(): T;
    isValid(): boolean;
}
