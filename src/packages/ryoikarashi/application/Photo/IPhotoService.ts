import { type AlbumId } from '@/packages/ryoikarashi/domain/models/Photo/ValueObjects';
import { type Photo } from '@/packages/ryoikarashi/domain/models/Photo/Photo';

export interface IPhotoService {
  getARandomPhotoFromAlbum: (albumId: AlbumId) => Promise<Photo>;
}
