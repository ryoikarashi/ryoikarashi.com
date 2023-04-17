import { type Photo } from '@/packages/ryoikarashi/domain/models/Photo/Photo';
import { type AlbumId } from '@/packages/ryoikarashi/domain/models/Photo/ValueObjects';
import { type AccessToken } from '@/packages/ryoikarashi/domain/models/Token/ValueObjects';

export interface IPhotoRepository {
  // queries
  getPhotosFromAlbum: (
    albumId: AlbumId,
    accessToken: AccessToken,
    callback: () => Promise<AccessToken>
  ) => Promise<Photo[]>;
}
