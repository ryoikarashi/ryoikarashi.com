import * as admin from "firebase-admin";
import {AxiosStatic} from "axios";
import {stringify, stringify as QsStringify} from "query-string";
import {Token} from "../../Domains/Token/Token";
import {AccessToken} from "../../Domains/Token/AccessToken";
import {RefreshToken} from "../../Domains/Token/RefreshToken";
import {getRootCollectionName} from "../../../utils";
import {IOAuthConfig, ITokenRepository} from "./ITokenRepository";

export class SpotifyTokenRepository implements ITokenRepository {
    private readonly _ref: admin.firestore.DocumentReference<FirebaseFirestore.DocumentData>;
    private readonly _collectionName = 'spotify_tokens';

    constructor(db: FirebaseFirestore.Firestore) {
        this._ref = db
            .collection(getRootCollectionName(this._collectionName))
            .doc('ryoikarashi-com');
    }

    public async storeAccessTokenAndMaybeRefreshToken(token: Token): Promise<void> {
        const doc = await this._ref.get();
        const data = token.refreshToken.isValid()
            ? { access_token: token.accessToken.value(), refresh_token: token.refreshToken.value() }
            : { access_token: token.accessToken.value() };
        doc.exists && (await this._ref.update(data)) || (await this._ref.create(data));
    }

    public async getFirstToken(): Promise<Token> {
        const doc = await this._ref.get();
        return new Token(
            AccessToken.of(doc?.exists && doc?.data()?.access_token || null),
            RefreshToken.of(doc?.exists && doc?.data()?.refresh_token || null),
        );
    }

    public async getTokenByAuthorizationCode(http: AxiosStatic, config: IOAuthConfig): Promise<Token> {
        const headers = {
            "Authorization": `Basic ${config.basicAuthorizationCode}`,
            "Content-Type": 'application/x-www-form-urlencoded',
        };
        const params = {
            "grant_type": "authorization_code",
            "code": config.authorizationCode,
            "redirect_uri": "https://example.com/callback"
        };

        const { data: { access_token: accessToken, refresh_token: refreshToken } } =
            await http.post("https://accounts.spotify.com/api/token", QsStringify(params), { headers });

        return new Token(
            AccessToken.of(accessToken),
            RefreshToken.of(refreshToken),
        );
    }

    public async refreshToken(http: AxiosStatic, expiredToken: Token, config: IOAuthConfig): Promise<Token> {
        const headers = {
            "Authorization": `Basic ${config.basicAuthorizationCode}`,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        const payload = {
            "grant_type": "refresh_token",
            "refresh_token": expiredToken.refreshToken.value(),
        };

        const { data: { access_token: accessToken, refresh_token: refreshToken } } =
            await http.post("https://accounts.spotify.com/api/token", stringify(payload), { headers });

        return Promise.resolve(
            new Token(
                AccessToken.of(accessToken),
                RefreshToken.of(refreshToken)
            )
        );
    }
}
