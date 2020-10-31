import axios from 'axios';
import { GooglePhotosRepository } from './GooglePhotosRepository';
import { Photo } from '../../Entities/Photo/Photo';
import { Url } from '../../Entities/Photo/Url';
import { AlbumId } from '../../Entities/Photo/AlbumId';
import { AccessToken } from '../../Entities/Token/AccessToken';
import { ResponseMediaItemsList } from '../../../types/google-photos';

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
        (item) => new Photo(Url.of(`${item.baseUrl}=w1200-h1200-no`)),
    );
    const albumId = AlbumId.of('album_id');
    const accessToken = AccessToken.of('access_token');
    const callback = async () => new AccessToken('new_access_token');

    it('returns an array of photos when api call succeeds', async () => {
        (axios as jest.Mocked<typeof axios>).post.mockResolvedValueOnce({ data: mediaItemsList });
        const repository = new GooglePhotosRepository(axios);
        await expect(repository.getPhotosFromAlbum(albumId, accessToken, callback)).resolves.toEqual(photos);
        expect(axios.post).toHaveBeenCalledTimes(1);
    });

    it('throws an exception first and catch the error and return an array of photos', async () => {
        (axios as jest.Mocked<typeof axios>).post
            .mockImplementationOnce(() => Promise.reject(new Error('requested access token is expired')))
            .mockImplementationOnce(() => Promise.resolve({ data: mediaItemsList }));
        const repository = new GooglePhotosRepository(axios);
        await expect(repository.getPhotosFromAlbum(albumId, accessToken, callback)).resolves.toEqual(photos);
        expect(axios.post).toHaveBeenCalledTimes(2);
    });
});
