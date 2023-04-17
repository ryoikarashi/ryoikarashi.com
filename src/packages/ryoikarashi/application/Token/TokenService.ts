import { AxiosStatic } from 'axios';
import { ITokenService } from './ITokenService';
import { Token } from '@/packages/ryoikarashi/domain/models/Token/Token';
import {
  AccessToken,
  RefreshToken,
} from '@/packages/ryoikarashi/domain/models/Token/ValueObjects';
import {
  IOAuthConfig,
  ITokenRepository,
} from '@/packages/ryoikarashi/infrastructure/repositories/TokenRepository/ITokenRepository';

export class TokenService implements ITokenService {
  private readonly _http: AxiosStatic;
  private readonly _tokenRepo: ITokenRepository;
  private readonly _config: IOAuthConfig;

  constructor(
    http: AxiosStatic,
    tokenRepo: ITokenRepository,
    config: IOAuthConfig
  ) {
    this._http = http;
    this._tokenRepo = tokenRepo;
    this._config = config;
  }

  // get an access token and refresh token with authorization code
  public async getAccessAndRefreshToken(): Promise<Token> {
    try {
      const currentToken = await this._tokenRepo.getFirstToken();

      if (
        currentToken.accessToken.isValid() &&
        currentToken.refreshToken.isValid()
      ) {
        return currentToken;
      }

      const tokenIssuedByAuthorizationCode =
        await this._tokenRepo.getTokenByAuthorizationCode(
          this._http,
          this._config
        );

      await this._tokenRepo.storeAccessTokenAndMaybeRefreshToken(
        tokenIssuedByAuthorizationCode
      );
      return Promise.resolve(tokenIssuedByAuthorizationCode);
    } catch (e) {
      return Promise.resolve(
        new Token(AccessToken.of(null), RefreshToken.of(null))
      );
    }
  }

  // refresh access token with refresh token (access token expires within 1 hour)
  public async refreshAccessToken(): Promise<AccessToken> {
    const token = await this._tokenRepo.getFirstToken();
    const refreshedToken = await this._tokenRepo.refreshToken(
      this._http,
      token,
      this._config
    );
    await this._tokenRepo.storeAccessTokenAndMaybeRefreshToken(refreshedToken);
    return refreshedToken.accessToken;
  }
}
