import { Photo } from '../../Entities/Photo/Photo';
import { AlbumId } from '../../Entities/Photo/ValueObjects';
import { AccessToken } from '../../Entities/Token/ValueObjects';

export interface IPhotoRepository {
    // queries
    getPhotosFromAlbum(
        albumId: AlbumId,
        accessToken: AccessToken,
        callback: () => Promise<AccessToken>,
    ): Promise<Array<Photo>>;
}
