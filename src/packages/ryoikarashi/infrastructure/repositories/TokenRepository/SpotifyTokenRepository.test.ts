import * as admin from 'firebase-admin';
import axios from 'axios';
import { stringify } from 'query-string';
import { SpotifyTokenRepository } from './SpotifyTokenRepository';
import { HTTPTokenResponse, IOAuthConfig } from './ITokenRepository';
import { Token } from '@/packages/ryoikarashi/domain/models/Token/Token';
import {
  RefreshToken,
  AccessToken,
} from '@/packages/ryoikarashi/domain/models/Token/ValueObjects';

// create mocks
jest.mock('axios');
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn().mockReturnThis(),
  firestore: jest.fn(() => ({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn(() => ({
      data: jest.fn(() => ({})),
      exists: true,
    })),
    update: jest.fn(),
    create: jest.fn(),
  })),
}));

// clear all mocks before each test
afterEach(() => {
  jest.clearAllMocks();
});

describe('Test SpotifyTokenRepository', () => {
  const oauthConfig: IOAuthConfig = {
    authorizationCode: 'authorization_code',
    clientId: 'client_id',
    clientSecret: 'client_secret',
    redirectUri: 'https://example.com/callback',
  };

  const httpTokenResponse: HTTPTokenResponse = {
    access_token: 'access_token_1',
    refresh_token: 'refresh_token_1',
  };

  const token = new Token(
    AccessToken.of(httpTokenResponse.access_token),
    RefreshToken.of(httpTokenResponse.refresh_token)
  );

  const collectionName = 'spotify_tokens';
  const docPath = 'ryoikarashi-com';

  describe('getTokenByAuthorizationCode', () => {
    it('it has been called with appropriate params', async () => {
      const repository = new SpotifyTokenRepository(
        admin.initializeApp().firestore(),
        collectionName,
        docPath
      );
      jest
        .spyOn(axios, 'post')
        .mockResolvedValueOnce({ data: httpTokenResponse });
      await repository.getTokenByAuthorizationCode(axios, oauthConfig);
      const tokenEndpoint = 'https://accounts.spotify.com/api/token';
      const params = {
        code: oauthConfig.authorizationCode,
        grant_type: 'authorization_code',
        redirect_uri: oauthConfig.redirectUri,
      };
      const requestConfig = {
        headers: {
          Authorization: `Basic ${oauthConfig.basicAuthorizationCode}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      expect(admin.initializeApp).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        tokenEndpoint,
        stringify(params),
        requestConfig
      );
    });

    it('returns a valid token', async () => {
      const repository = new SpotifyTokenRepository(
        admin.initializeApp().firestore(),
        collectionName,
        docPath
      );
      jest
        .spyOn(axios, 'post')
        .mockResolvedValueOnce({ data: httpTokenResponse });

      expect(admin.initializeApp).toHaveBeenCalledTimes(1);
      await expect(
        repository.getTokenByAuthorizationCode(axios, oauthConfig)
      ).resolves.toEqual(token);
    });

    it('throws an exception', async () => {
      const db = admin.initializeApp().firestore();
      const repository = new SpotifyTokenRepository(
        db,
        collectionName,
        docPath
      );
      jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error());

      expect(admin.initializeApp).toHaveBeenCalledTimes(1);
      await expect(
        repository.getTokenByAuthorizationCode(axios, oauthConfig)
      ).rejects.toEqual(new Error());
    });
  });

  describe('refreshToken', () => {
    const newHttpTokenResponse = {
      access_token: 'new_access_token',
      refresh_token: 'new_refresh_token',
    };
    const newToken = new Token(
      AccessToken.of(newHttpTokenResponse.access_token),
      RefreshToken.of(newHttpTokenResponse.refresh_token)
    );

    it('it has been called with appropriate params', async () => {
      const params = {
        grant_type: 'refresh_token',
        refresh_token: httpTokenResponse.refresh_token,
      };
      const requestConfig = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${oauthConfig.basicAuthorizationCode}`,
        },
      };

      const repository = new SpotifyTokenRepository(
        admin.initializeApp().firestore(),
        collectionName,
        docPath
      );
      jest
        .spyOn(axios, 'post')
        .mockResolvedValueOnce({ data: newHttpTokenResponse });
      await repository.refreshToken(axios, token, oauthConfig);
      const tokenEndpoint = 'https://accounts.spotify.com/api/token';

      expect(admin.initializeApp).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        tokenEndpoint,
        stringify(params),
        requestConfig
      );
    });

    it('returns a new token', async () => {
      const repository = new SpotifyTokenRepository(
        admin.initializeApp().firestore(),
        collectionName,
        docPath
      );
      jest
        .spyOn(axios, 'post')
        .mockResolvedValueOnce({ data: newHttpTokenResponse });
      expect(admin.initializeApp).toHaveBeenCalledTimes(1);
      await expect(
        repository.refreshToken(axios, token, oauthConfig)
      ).resolves.toEqual(newToken);
    });

    it('throws an exception', async () => {
      const repository = new SpotifyTokenRepository(
        admin.initializeApp().firestore(),
        collectionName,
        docPath
      );
      jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error());

      expect(admin.initializeApp).toHaveBeenCalledTimes(1);
      await expect(
        repository.refreshToken(axios, token, oauthConfig)
      ).rejects.toEqual(new Error());
    });
  });
});
