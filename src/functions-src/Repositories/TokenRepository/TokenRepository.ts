import * as admin from "firebase-admin";
import {ITokenRepository} from "./ITokenRepository";
import {Token} from "../../Domains/Token/Token";
import {AccessToken} from "../../Domains/Token/AccessToken";
import {RefreshToken} from "../../Domains/Token/RefreshToken";

export class TokenRepository implements ITokenRepository {
    private readonly ref: admin.firestore.DocumentReference<FirebaseFirestore.DocumentData>;

    constructor(db: FirebaseFirestore.Firestore) {
        this.ref = db.collection('spotify_tokens').doc('ryoikarashi-com');
    }

    async storeAccessTokenAndMaybeRefreshToken(token: Token): Promise<void> {
        const doc = await this.ref.get();
        const data = token.refreshToken().isValid()
            ? { access_token: token.accessToken().value(), refresh_token: token.refreshToken().value() }
            : { access_token: token.accessToken().value() };
        doc.exists && (await this.ref.update(data)) || (await this.ref.create(data));
    }

    async getFirstToken(): Promise<Token> {
        const doc = await this.ref.get();
        return new Token(
            AccessToken.of(doc?.exists && doc?.data()?.access_token || null),
            RefreshToken.of(doc?.exists && doc?.data()?.refresh_token || null),
        );
    }
}
