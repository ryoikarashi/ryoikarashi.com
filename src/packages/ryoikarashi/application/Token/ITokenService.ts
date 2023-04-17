import { Token } from '@/packages/ryoikarashi/domain/models/Token/Token';
import { AccessToken } from '@/packages/ryoikarashi/domain/models/Token/ValueObjects';

export interface ITokenService {
  getAccessAndRefreshToken(): Promise<Token>;
  refreshAccessToken(): Promise<AccessToken>;
}
