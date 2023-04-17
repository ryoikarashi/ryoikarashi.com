import { AxiosStatic } from 'axios';
import { IPhotoRepository } from './IPhotoRepository';
import {
  AlbumId,
  Height,
  Width,
  Url,
} from '@/packages/ryoikarashi/domain/models/Photo/ValueObjects';
import { Photo } from '@/packages/ryoikarashi/domain/models';
import { AccessToken } from '@/packages/ryoikarashi/domain/models/Token/ValueObjects';

export interface MediaItem {
  id: string;
  description: string;
  productUrl: string;
  baseUrl: string;
  mimeType: string;
  filename: string;
  mediaMetadata: MediaMetadata;
}

export type MediaItems = Array<MediaItem>;

export interface ResponseMediaItemsList {
  mediaItems: MediaItems;
  nextPageToken: string;
}

export interface MediaMetadata {
  creationTime: string;
  width: string;
  height: string;
  photo: MediaMetadataPhoto;
}

export interface MediaMetadataPhoto {
  cameraMake: string;
  cameraModel: string;
  focalLength: number;
  apertureFNumber: number;
  isoEquivalent: number;
  exposureTime: string;
}

export class GooglePhotosRepository implements IPhotoRepository {
  private readonly _http: AxiosStatic;

  constructor(http: AxiosStatic) {
    this._http = http;
  }

  async getPhotosFromAlbum(
    albumId: AlbumId,
    accessToken: AccessToken,
    callback: () => Promise<AccessToken>
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
        { headers }
      );

      if (!mediaItems) {
        return [new Photo(Url.of(null), Width.of(null), Height.of(null))];
      }

      return mediaItems.map(
        (mediaItem) =>
          new Photo(
            Url.of(`${mediaItem.baseUrl}=w1200-h1200-no`),
            Width.of(Number(mediaItem.mediaMetadata.width)),
            Height.of(Number(mediaItem.mediaMetadata.height))
          )
      );
    } catch (e) {
      const newAccessToken = await callback();
      return await this.getPhotosFromAlbum(albumId, newAccessToken, callback);
    }
  }
}
