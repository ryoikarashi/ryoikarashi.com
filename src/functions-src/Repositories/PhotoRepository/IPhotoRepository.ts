import { Photo } from '../../Entities/Photo/Photo';
import { AlbumId } from '../../Entities/Photo/AlbumId';
import { AccessToken } from '../../Entities/Token/AccessToken';

export interface IPhotoRepository {
    // queries
    getPhotosFromAlbum(
        albumId: AlbumId,
        accessToken: AccessToken,
        callback: () => Promise<AccessToken>,
    ): Promise<Array<Photo>>;
}
