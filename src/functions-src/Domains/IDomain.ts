export interface IDomain {
    isValid(): boolean;
    toJson(): {
        [key: string]: unknown;
    };
}
