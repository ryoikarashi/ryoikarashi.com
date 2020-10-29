import {AlbumId} from "../../Domains/Photo/AlbumId";
import {Photo} from "../../Domains/Photo/Photo";

export interface IGooglePhotoService {
    getARandomPhotoFromAlbum(albumId: AlbumId): Promise<Photo>;
}
