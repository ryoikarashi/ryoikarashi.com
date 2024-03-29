import axios from 'axios';
import admin from 'firebase-admin';
import * as GooglePhotosRepository from '@/packages/ryoikarashi/infrastructure/repositories/PhotoRepository/GooglePhotosRepository';
import * as GooglePhotoService from './GooglePhotoService';
import * as GoogleTokenRepository from '@/packages/ryoikarashi/infrastructure/repositories/TokenRepository/GoogleTokenRepository';
import * as TokenService from '../Token/TokenService';
import {
  type IOAuthConfig,
  type ITokenRepository,
} from '@/packages/ryoikarashi/infrastructure/repositories/TokenRepository/ITokenRepository';
import {
  AlbumId,
  Url,
  Width,
  Height,
} from '@/packages/ryoikarashi/domain/models/Photo/ValueObjects';
import { Photo } from '@/packages/ryoikarashi/domain/models/Photo/Photo';
import { Token } from '@/packages/ryoikarashi/domain/models/Token/Token';
import {
  AccessToken,
  RefreshToken,
} from '@/packages/ryoikarashi/domain/models/Token/ValueObjects';
import { type IPhotoRepository } from '@/packages/ryoikarashi/infrastructure/repositories/PhotoRepository/IPhotoRepository';

// create mocks
jest.mock('axios');
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn().mockReturnThis(),
  firestore: jest.fn(),
}));

jest.mock(
  '../../infrastructure/repositories/TokenRepository/GoogleTokenRepository'
);
const MockedGoogleTokenRepository =
  GoogleTokenRepository.GoogleTokenRepository as jest.Mock<ITokenRepository>;

jest.mock(
  '../../infrastructure/repositories/PhotoRepository/GooglePhotosRepository',
  () => ({
    GooglePhotosRepository: jest.fn(() => ({
      getPhotosFromAlbum: jest.fn(),
    })),
  })
);
const MockedGooglePhotosRepository =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  GooglePhotosRepository.GooglePhotosRepository as jest.Mock<IPhotoRepository>;

jest.mock('../Token/TokenService', () => ({
  TokenService: jest.fn(() => ({
    getAccessAndRefreshToken: jest
      .fn()
      .mockResolvedValue(
        new Token(
          AccessToken.of('access_token'),
          RefreshToken.of('refresh_token')
        )
      ),
  })),
}));
const MockedTokenService = TokenService.TokenService;

const config: IOAuthConfig = {
  authorizationCode: '',
  clientId: '',
  clientSecret: '',
  redirectUri: '',
};

const albumId: AlbumId = AlbumId.of('album_id');

// clear all mocks
afterEach(() => {
  jest.clearAllMocks();
});

describe('Test GooglePhotoService', () => {
  describe('getARandomPhotoFromAlbum', () => {
    const data: Photo[] = [
      new Photo(
        Url.of('https://example.com/photo'),
        Width.of(100),
        Height.of(100)
      ),
    ];
    const randomPhoto = data[0];
    const invalidData: Photo[] = [];
    const invalidRandomPhoto = new Photo(
      Url.of(null),
      Width.of(null),
      Height.of(null)
    );

    it('returns a random photo', async () => {
      MockedGooglePhotosRepository.mockImplementation(() => ({
        getPhotosFromAlbum: async (albumId, accessToken, callback) => data,
      }));
      const service = new GooglePhotoService.GooglePhotoService(
        new MockedGooglePhotosRepository(axios),
        new MockedTokenService(
          axios,
          new MockedGoogleTokenRepository(
            admin.initializeApp().firestore(),
            'test',
            'test'
          ),
          config
        )
      );

      await expect(service.getARandomPhotoFromAlbum(albumId)).resolves.toEqual(
        randomPhoto
      );
    });

    it('returns a invalid photo', async () => {
      MockedGooglePhotosRepository.mockImplementation(() => ({
        getPhotosFromAlbum: async (albumId, accessToken, callback) =>
          invalidData,
      }));
      const service = new GooglePhotoService.GooglePhotoService(
        new MockedGooglePhotosRepository(axios),
        new MockedTokenService(
          axios,
          new MockedGoogleTokenRepository(
            admin.initializeApp().firestore(),
            'test',
            'test'
          ),
          config
        )
      );

      await expect(service.getARandomPhotoFromAlbum(albumId)).resolves.toEqual(
        invalidRandomPhoto
      );
    });
  });
});
