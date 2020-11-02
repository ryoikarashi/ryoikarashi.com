import { AxiosStatic } from 'axios';
import { Token } from '../../Entities/Token/Token';
import * as admin from 'firebase-admin';
import { getRootCollectionName } from '../../../utils';
import { AccessToken } from '../../Entities/Token/AccessToken';
import { RefreshToken } from '../../Entities/Token/RefreshToken';

export interface IOAuthConfig {
    clientId: string;
    clientSecret: string;
    authorizationCode: string;
    basicAuthorizationCode?: string;
    redirectUri: string;
}

export interface HTTPTokenResponse {
    access_token: string | null;
    refresh_token: string | null;
}

export abstract class ITokenRepository {
    private readonly _ref: admin.firestore.DocumentReference<FirebaseFirestore.DocumentData>;

    public constructor(db: FirebaseFirestore.Firestore, collectionName: string, docPath: string) {
        this._ref = db.collection(getRootCollectionName(collectionName)).doc(docPath);
    }

    // queries
    abstract getTokenByAuthorizationCode(http: AxiosStatic, config: IOAuthConfig): Promise<Token>;
    abstract refreshToken(http: AxiosStatic, expiredToken: Token, config: IOAuthConfig): Promise<Token>;

    public async getFirstToken(): Promise<Token> {
        const doc = await this._ref.get();
        return new Token(
            AccessToken.of(doc?.exists ? doc?.data()?.access_token || null : null),
            RefreshToken.of(doc?.exists ? doc?.data()?.refresh_token || null : null),
        );
    }

    // commands
    public async storeAccessTokenAndMaybeRefreshToken(token: Token): Promise<void> {
        const doc = await this._ref.get();
        const data = token.refreshToken.isValid()
            ? { access_token: token.accessToken.value(), refresh_token: token.refreshToken.value() }
            : { access_token: token.accessToken.value() };
        doc.exists ? await this._ref.update(data) : await this._ref.create(data);
    }
}
