import Pusher, { Options } from 'pusher';

export class PusherService {
    private readonly _appId: string;
    private readonly _key: string;
    private readonly _secret: string;
    private readonly _cluster: string | undefined;
    private readonly _useTLS: boolean | undefined;

    constructor(params: Options) {
        this._appId = params.appId;
        this._key = params.key;
        this._secret = params.secret;
        this._cluster = 'cluster' in params ? params.cluster : undefined;
        this._useTLS = params.useTLS;
    }

    public init(): Pusher {
        return new Pusher({
            appId: this._appId,
            key: this._key,
            secret: this._secret,
            cluster: this._cluster || '',
            useTLS: this._useTLS,
        });
    }
}
