import { type AxiosStatic } from 'axios';
import { Token } from '@/packages/ryoikarashi/domain/models/Token/Token';
import type * as admin from 'firebase-admin';
import { getRootCollectionName } from '@/libs/utils';
import {
  AccessToken,
  RefreshToken,
} from '@/packages/ryoikarashi/domain/models/Token/ValueObjects';

export interface IOAuthConfig {
  clientId: string;
  clientSecret: string;
  authorizationCode: string;
  basicAuthorizationCode?: string;
  redirectUri: string;
}

export interface HTTPTokenResponse {
  access_token?: string | null;
  refresh_token?: string | null;
}

export abstract class ITokenRepository {
  private readonly _ref: admin.firestore.DocumentReference<FirebaseFirestore.DocumentData>;

  public constructor(
    db: FirebaseFirestore.Firestore,
    collectionName: string,
    docPath: string
  ) {
    this._ref = db
      .collection(getRootCollectionName(collectionName))
      .doc(docPath);
  }

  // queries
  abstract getTokenByAuthorizationCode(
    http: AxiosStatic,
    config: IOAuthConfig
  ): Promise<Token>;
  abstract refreshToken(
    http: AxiosStatic,
    expiredToken: Token,
    config: IOAuthConfig
  ): Promise<Token>;

  public async getFirstToken(): Promise<Token> {
    const doc = await this._ref.get();
    const data = doc.data() as
      | undefined
      | null
      | { access_token: string; refresh_token: string };
    return new Token(
      AccessToken.of(data?.access_token ?? null),
      RefreshToken.of(data?.refresh_token ?? null)
    );
  }

  // commands
  public async storeAccessTokenAndMaybeRefreshToken(
    token: Token
  ): Promise<void> {
    const doc = await this._ref.get();
    const data = token.refreshToken.isValid()
      ? {
          access_token: token.accessToken.value(),
          refresh_token: token.refreshToken.value(),
        }
      : { access_token: token.accessToken.value() };
    doc.exists ? await this._ref.update(data) : await this._ref.create(data);
  }
}
