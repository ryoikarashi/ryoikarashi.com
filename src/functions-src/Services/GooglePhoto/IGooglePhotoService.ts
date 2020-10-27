import {AlbumId} from "../../Domains/Photo/AlbumId";
import {AccessToken} from "../../Domains/Token/AccessToken";
import {Token} from "../../Domains/Token/Token";
import {Photo} from "../../Domains/Photo/Photo";

export interface IGooglePhotoService {
    refreshAccessToken(): Promise<AccessToken>;
    getToken(): Promise<Token>;
    getARandomPhotoFromAlbum(accessToken: AccessToken, albumId: AlbumId): Promise<Photo>;
}
