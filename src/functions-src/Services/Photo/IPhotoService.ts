import { AlbumId } from '../../Entities/Photo/ValueObjects';
import { Photo } from '../../Entities/Photo/Photo';

export interface IPhotoService {
    getARandomPhotoFromAlbum(albumId: AlbumId): Promise<Photo>;
}
