import { type AxiosStatic } from 'axios';
import qs from 'query-string';
import { Token } from '@/packages/ryoikarashi/domain/models/Token/Token';
import {
  AccessToken,
  RefreshToken,
} from '@/packages/ryoikarashi/domain/models/Token/ValueObjects';
import {
  type HTTPTokenResponse,
  type IOAuthConfig,
  ITokenRepository,
} from './ITokenRepository';

export class GoogleTokenRepository extends ITokenRepository {
  public constructor(
    db: FirebaseFirestore.Firestore,
    collectionName: string,
    docPath: string
  ) {
    super(db, collectionName, docPath);
  }

  public async getTokenByAuthorizationCode(
    http: AxiosStatic,
    config: IOAuthConfig
  ): Promise<Token> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const payload = {
      code: config.authorizationCode,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    };

    const {
      data: { access_token: accessToken, refresh_token: refreshToken },
    } = await http.post<HTTPTokenResponse>(
      'https://www.googleapis.com/oauth2/v4/token',
      qs.stringify(payload),
      {
        headers,
      }
    );

    return new Token(
      AccessToken.of(accessToken ?? null),
      RefreshToken.of(refreshToken ?? null)
    );
  }

  public async refreshToken(
    http: AxiosStatic,
    expiredToken: Token,
    config: IOAuthConfig
  ): Promise<Token> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const payload = {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: expiredToken.refreshToken.value(),
      grant_type: 'refresh_token',
    };

    const {
      data: { access_token: accessToken, refresh_token: refreshToken },
    } = await http.post<HTTPTokenResponse>(
      'https://www.googleapis.com/oauth2/v4/token',
      qs.stringify(payload),
      { headers }
    );

    return new Token(
      AccessToken.of(accessToken ?? null),
      RefreshToken.of(refreshToken ?? expiredToken.refreshToken.value())
    );
  }
}
