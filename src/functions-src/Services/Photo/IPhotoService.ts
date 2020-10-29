import {AlbumId} from "../../Domains/Photo/AlbumId";
import {Photo} from "../../Domains/Photo/Photo";

export interface IPhotoService {
    getARandomPhotoFromAlbum(albumId: AlbumId): Promise<Photo>;
}
