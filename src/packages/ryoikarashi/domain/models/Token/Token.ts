import { RefreshToken, AccessToken } from './ValueObjects';
import { IDomain } from '../IDomain';

export interface TokenPlainObj {
  accessToken: string;
  refreshToken: string;
}

export class Token implements IDomain<TokenPlainObj> {
  private readonly _accessToken: AccessToken;
  private readonly _refreshToken: RefreshToken;

  constructor(accessToken: AccessToken, refreshToken: RefreshToken) {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
  }

  public get accessToken(): AccessToken {
    return this._accessToken;
  }

  public get refreshToken(): RefreshToken {
    return this._refreshToken;
  }

  isValid(): boolean {
    return (
      this._accessToken.value() !== null && !!this._accessToken.value().length
    );
  }

  toPlainObj(): TokenPlainObj {
    return {
      accessToken: this._accessToken.value(),
      refreshToken: this._refreshToken.value(),
    };
  }

  toJson(): string {
    return JSON.stringify(this.toPlainObj());
  }
}
