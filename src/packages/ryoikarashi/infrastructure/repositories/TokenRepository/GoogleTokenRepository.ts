import { type AxiosStatic } from 'axios';
import { stringify } from 'query-string';
import { Token } from '@/packages/ryoikarashi/domain/models/Token/Token';
import {
  AccessToken,
  RefreshToken,
} from '@/packages/ryoikarashi/domain/models/Token/ValueObjects';
import { type IOAuthConfig, ITokenRepository } from './ITokenRepository';

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
    } = await http.post(
      'https://www.googleapis.com/oauth2/v4/token',
      stringify(payload),
      { headers }
    );

    return new Token(
      AccessToken.of(accessToken),
      RefreshToken.of(refreshToken)
    );
  }

  public async refreshToken(
    http: AxiosStatic,
    currentToken: Token,
    config: IOAuthConfig
  ): Promise<Token> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const payload = {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: currentToken.refreshToken.value(),
      grant_type: 'refresh_token',
    };

    const {
      data: { access_token: accessToken, refresh_token: refreshToken },
    } = await http.post(
      'https://www.googleapis.com/oauth2/v4/token',
      stringify(payload),
      { headers }
    );

    return new Token(
      AccessToken.of(accessToken),
      RefreshToken.of(refreshToken)
    );
  }
}
