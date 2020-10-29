import * as admin from "firebase-admin";
import {AxiosStatic} from "axios";
import {stringify} from "query-string";
import {Token} from "../../Domains/Token/Token";
import {AccessToken} from "../../Domains/Token/AccessToken";
import {RefreshToken} from "../../Domains/Token/RefreshToken";
import {getRootCollectionName} from "../../../utils";
import {IOAuthConfig, ITokenRepository} from "./ITokenRepository";

export class GoogleTokenRepository implements ITokenRepository {
    private readonly _ref: admin.firestore.DocumentReference<FirebaseFirestore.DocumentData>;
    private readonly _collectionName = 'google_tokens';
    private readonly _docPath = 'ryoikarashi-com';

    constructor(db: FirebaseFirestore.Firestore) {
        this._ref = db
            .collection(getRootCollectionName(this._collectionName))
            .doc(this._docPath);
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
            "Content-Type": 'application/x-www-form-urlencoded',
        };
        const payload = {
            "code": config.authorizationCode,
            "client_id": config.clientId,
            "client_secret": config.clientSecret,
            "redirect_uri": config.redirectUri,
            "grant_type": "authorization_code",
        };

        const { data: { access_token: accessToken, refresh_token: refreshToken } } =
            await http.post("https://www.googleapis.com/oauth2/v4/token", stringify(payload), { headers });

        return new Token(
            AccessToken.of(accessToken),
            RefreshToken.of(refreshToken),
        );
    }

    public async refreshToken(http: AxiosStatic, currentToken: Token, config: IOAuthConfig): Promise<Token> {
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        };

        const payload = {
            "client_id": config.clientId,
            "client_secret": config.clientSecret,
            "refresh_token": currentToken.refreshToken.value(),
            "grant_type": "refresh_token",
        };

        const { data: { access_token: accessToken, refresh_token: refreshToken } } =
            await http.post("https://www.googleapis.com/oauth2/v4/token", stringify(payload), { headers });

        return Promise.resolve(
            new Token(
                AccessToken.of(accessToken),
                RefreshToken.of(refreshToken)
            )
        );
    }
}
