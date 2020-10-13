import Pusher, {Options} from "pusher";

export class PusherService {
    private readonly appId: string;
    private readonly key: string;
    private readonly secret: string;
    private readonly cluster: string | undefined;
    private readonly encrypted: boolean | undefined;

    constructor(params: Options) {
        this.appId = params.appId;
        this.key = params.key;
        this.secret = params.secret;
        this.cluster = "cluster" in params ? params.cluster : undefined;
        this.encrypted = params.encrypted;
    }

    init(): Pusher {
        return new Pusher({
            appId: this.appId,
            key: this.key,
            secret: this.secret,
            cluster: this.cluster || '',
            encrypted: this.encrypted,
        });
    }
}
