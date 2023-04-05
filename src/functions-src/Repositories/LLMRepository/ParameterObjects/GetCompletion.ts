export class GetCompletion {
    private _message: string;

    constructor(message: string) {
        this._message = message;
    }

    public get message(): string {
        return this._message;
    }

    public set message(message: string) {
        this._message = message;
    }
}
