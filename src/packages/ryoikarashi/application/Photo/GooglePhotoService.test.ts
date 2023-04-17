import axios from 'axios';
import admin from 'firebase-admin';
import * as GooglePhotosRepository from '@/packages/ryoikarashi/infrastructure/repositories/PhotoRepository/GooglePhotosRepository';
import * as GooglePhotoService from './GooglePhotoService';
import * as GoogleTokenRepository from '@/packages/ryoikarashi/infrastructure/repositories/TokenRepository/GoogleTokenRepository';
import * as TokenService from '../Token/TokenService';
import { IOAuthConfig } from '@/packages/ryoikarashi/infrastructure/repositories/TokenRepository/ITokenRepository';
import { AlbumId } from '@/packages/ryoikarashi/domain/models/Photo/ValueObjects';
import { Photo } from '@/packages/ryoikarashi/domain/models/Photo/Photo';
import { Token } from '@/packages/ryoikarashi/domain/models/Token/Token';
import {
  AccessToken,
  RefreshToken,
} from '@/packages/ryoikarashi/domain/models/Token/ValueObjects';
import {
  Url,
  Width,
  Height,
} from '@/packages/ryoikarashi/domain/models/Photo/ValueObjects';

// create mocks
jest.mock('axios');
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn().mockReturnThis(),
  firestore: jest.fn(),
}));

jest.mock('../../Repositories/TokenRepository/GoogleTokenRepository');
const MockedGoogleTokenRepository =
  GoogleTokenRepository.GoogleTokenRepository as jest.Mock;

jest.mock('../../Repositories/PhotoRepository/GooglePhotosRepository', () => ({
  GooglePhotosRepository: jest.fn(() => ({
    getPhotosFromAlbum: jest.fn(),
  })),
}));
const MockedGooglePhotosRepository =
  GooglePhotosRepository.GooglePhotosRepository as jest.Mock;

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
    const data: Array<Photo> = [
      new Photo(
        Url.of('https://example.com/photo'),
        Width.of(100),
        Height.of(100)
      ),
    ];
    const randomPhoto = data[0];
    const invalidData: Array<Photo> = [];
    const invalidRandomPhoto = new Photo(
      Url.of(null),
      Width.of(null),
      Height.of(null)
    );

    it('returns a random photo', async () => {
      MockedGooglePhotosRepository.mockImplementation(() => ({
        getPhotosFromAlbum: () => data,
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
        getPhotosFromAlbum: () => invalidData,
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
