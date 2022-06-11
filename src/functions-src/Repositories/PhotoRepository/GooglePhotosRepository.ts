import { AxiosStatic } from 'axios';
import { IPhotoRepository } from './IPhotoRepository';
import { AlbumId } from '../../Entities/Photo/AlbumId';
import { Photo } from '../../Entities/Photo/Photo';
import { AccessToken } from '../../Entities/Token/AccessToken';
import { Url } from '../../Entities/Photo/Url';
import { ResponseMediaItemsList } from '../../../types/google-photos';
import { Width } from '../../Entities/Photo/Width';
import { Height } from '../../Entities/Photo/Height';

export class GooglePhotosRepository implements IPhotoRepository {
    private readonly _http: AxiosStatic;

    constructor(http: AxiosStatic) {
        this._http = http;
    }

    async getPhotosFromAlbum(
        albumId: AlbumId,
        accessToken: AccessToken,
        callback: () => Promise<AccessToken>,
    ): Promise<Array<Photo>> {
        try {
            const headers = {
                Authorization: `Bearer ${accessToken.value()}`,
                'Content-Type': 'application/json',
            };
            const data = JSON.stringify({
                pageSize: process.env.GOOGLE_PHOTOS_PAGE_SIZE || '10',
                albumId: albumId.value(),
            });
            const {
                data: { mediaItems },
            } = await this._http.post<ResponseMediaItemsList>(
                'https://photoslibrary.googleapis.com/v1/mediaItems:search',
                data,
                { headers },
            );

            if (!mediaItems) {
                return [new Photo(Url.of(null), Width.of(null), Height.of(null))];
            }

            return mediaItems.map(
                (mediaItem) =>
                    new Photo(
                        Url.of(`${mediaItem.baseUrl}=w1200-h1200-no`),
                        Width.of(mediaItem.mediaMetadata.width),
                        Height.of(mediaItem.mediaMetadata.height),
                    ),
            );
        } catch (e) {
            const newAccessToken = await callback();
            return await this.getPhotosFromAlbum(albumId, newAccessToken, callback);
        }
    }
}
