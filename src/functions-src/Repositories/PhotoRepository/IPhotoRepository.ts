import {Photo} from "../../Domains/Photo/Photo";
import {AlbumId} from "../../Domains/Photo/AlbumId";
import {AccessToken} from "../../Domains/Token/AccessToken";

export interface IPhotoRepository {
    // queries
    getPhotosFromAlbum(albumId: AlbumId, accessToken: AccessToken, callback: () => Promise<AccessToken>): Promise<Array<Photo>>;
}
