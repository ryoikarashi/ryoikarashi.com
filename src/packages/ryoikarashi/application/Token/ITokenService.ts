import { type Token } from '@/packages/ryoikarashi/domain/models/Token/Token';
import { type AccessToken } from '@/packages/ryoikarashi/domain/models/Token/ValueObjects';

export interface ITokenService {
  getAccessAndRefreshToken: () => Promise<Token>;
  refreshAccessToken: () => Promise<AccessToken>;
}
