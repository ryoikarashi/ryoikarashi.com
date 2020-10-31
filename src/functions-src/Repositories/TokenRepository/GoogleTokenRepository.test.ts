import axios from 'axios';
import { GoogleTokenRepository } from './GoogleTokenRepository';
import { HTTPTokenResponse, IOAuthConfig } from './ITokenRepository';
import { Token } from '../../Entities/Token/Token';
import { RefreshToken } from '../../Entities/Token/RefreshToken';
import { AccessToken } from '../../Entities/Token/AccessToken';
import * as admin from 'firebase-admin';

// create mocks
jest.mock('axios').mock('firebase-admin', () => ({
    initializeApp: jest.fn(() => ({
        firestore: jest.fn(),
    })),
}));

// clear all mocks before each test
afterEach(() => {
    jest.clearAllMocks();
});

it('is true', () => {
    expect(true).toBe(true);
});

//
// const db = admin.initializeApp().firestore();
//
// const repository = new GoogleTokenRepository(db);
// const httpTokenResponse: HTTPTokenResponse = {
//    access_token: 'access_token',
//    refresh_token: 'refresh_token',
// };
// const oauthConfig: IOAuthConfig = {
//    authorizationCode: "authorization_code",
//    clientId: "client_id",
//    clientSecret: "client_secret",
//    redirectUri: "https://example.com/callback",
// };
// const token = new Token(
//     AccessToken.of(httpTokenResponse.access_token),
//     RefreshToken.of(httpTokenResponse.access_token),
// )

// describe('storeAccessTokenAndMaybeRefreshToken', () => {
//
// });
//
// describe('getFirstToken', () => {
//    const get = jest.fn();
//    const doc = jest.fn(() => ({ get }));
//    const collection = jest.spyOn(db, 'collection').mockReturnValueOnce({ doc });
// });
//
// describe('getTokenByAuthorizationCode', () => {
//    it('returns a valid token', async () => {
//       (axios as jest.Mocked<typeof axios>).post.mockResolvedValueOnce({ data: httpTokenResponse });
//       await expect(repository.getTokenByAuthorizationCode(axios, oauthConfig)).toEqual(token);
//    });
//
//    it('returns an invalid token', async () => {
//       (axios as jest.Mocked<typeof axios>).post.mockRejectedValueOnce(new Error('something went wrong'));
//       await expect(repository.getTokenByAuthorizationCode(axios, oauthConfig)).toEqual(token);
//    });
// });
//
// describe('refreshToken', () => {
//
// });
