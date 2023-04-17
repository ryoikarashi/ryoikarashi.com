import axios from 'axios';
import {
  GooglePhotosRepository,
  ResponseMediaItemsList,
} from './GooglePhotosRepository';
import { Photo } from '@/packages/ryoikarashi/domain/models/Photo/Photo';
import {
  AlbumId,
  Width,
  Height,
  Url,
} from '@/packages/ryoikarashi/domain/models/Photo/ValueObjects';
import { AccessToken } from '@/packages/ryoikarashi/domain/models/Token/ValueObjects';

// mock http client
jest.mock('axios');

// restore all mocks
afterEach(() => {
  jest.clearAllMocks();
});

describe('Test GooglePhotosRepository', () => {
  const mediaItemsList: ResponseMediaItemsList = {
    mediaItems: [
      {
        id: '1',
        description: 'test',
        productUrl: 'https://example.com/1.jpeg',
        baseUrl: 'https://example.com/1.jpeg',
        mimeType: 'jpeg',
        filename: '1.jpeg',
        mediaMetadata: {
          creationTime: '',
          width: '2450',
          height: '1900',
          photo: {
            cameraMake: 'string',
            cameraModel: 'string',
            focalLength: 1,
            apertureFNumber: 1,
            isoEquivalent: 1,
            exposureTime: 'string',
          },
        },
      },
      {
        id: '2',
        description: 'test',
        productUrl: 'https://example.com/2.jpeg',
        baseUrl: 'https://example.com/2.jpeg',
        mimeType: 'jpeg',
        filename: '2.jpeg',
        mediaMetadata: {
          creationTime: '',
          width: '1950',
          height: '1400',
          photo: {
            cameraMake: 'string',
            cameraModel: 'string',
            focalLength: 1,
            apertureFNumber: 1,
            isoEquivalent: 1,
            exposureTime: 'string',
          },
        },
      },
    ],
    nextPageToken: 'next_page_token',
  };
  const photos: Array<Photo> = mediaItemsList.mediaItems.map(
    (item) =>
      new Photo(
        Url.of(`${item.baseUrl}=w1200-h1200-no`),
        Width.of(Number(item.mediaMetadata.width)),
        Height.of(Number(item.mediaMetadata.height))
      )
  );
  const albumId = AlbumId.of('album_id');
  const accessToken = AccessToken.of('access_token');
  const callback = async () => new AccessToken('new_access_token');

  describe('getPhotosFromAlbum', () => {
    it('returns an array of photos when api call succeeds', async () => {
      jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: mediaItemsList });
      const repository = new GooglePhotosRepository(axios);
      await expect(
        repository.getPhotosFromAlbum(albumId, accessToken, callback)
      ).resolves.toEqual(photos);
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it('throws an exception first and catch the error and return an array of photos', async () => {
      jest
        .spyOn(axios, 'post')
        .mockImplementationOnce(() =>
          Promise.reject(new Error('requested access token is expired'))
        )
        .mockImplementationOnce(() =>
          Promise.resolve({ data: mediaItemsList })
        );
      const repository = new GooglePhotosRepository(axios);
      await expect(
        repository.getPhotosFromAlbum(albumId, accessToken, callback)
      ).resolves.toEqual(photos);
      expect(axios.post).toHaveBeenCalledTimes(2);
    });
  });
});
