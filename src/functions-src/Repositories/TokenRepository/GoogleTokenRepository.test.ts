import * as admin from 'firebase-admin';
import axios from 'axios';
import { GoogleTokenRepository } from './GoogleTokenRepository';
import { HTTPTokenResponse, IOAuthConfig } from './ITokenRepository';
import { Token } from '../../Entities/Token/Token';
import { RefreshToken } from '../../Entities/Token/RefreshToken';
import { AccessToken } from '../../Entities/Token/AccessToken';
import { getRootCollectionName } from '../../../utils';
import { stringify } from 'query-string';

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

describe('Test GooglePhotosRepository', () => {
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
        RefreshToken.of(httpTokenResponse.refresh_token),
    );

    const invalidToken = new Token(AccessToken.of(null), RefreshToken.of(null));

    describe('storeAccessTokenAndMaybeRefreshToken', () => {
        it('creates a new doc for tokens on firestore', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            jest.spyOn(admin, 'firestore').mockImplementation((): any => ({
                collection: jest.fn().mockReturnThis(),
                doc: jest.fn().mockReturnThis(),
                get: jest.fn(() => ({
                    data: jest.fn(() => httpTokenResponse),
                    exists: false,
                })),
                update: jest.fn(),
                create: jest.fn(),
            }));
            const firestore = admin.initializeApp().firestore();
            const repository = new GoogleTokenRepository(firestore);
            await repository.storeAccessTokenAndMaybeRefreshToken(token);

            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName('google_tokens'));
            expect(firestore.doc).toHaveBeenCalledWith('ryoikarashi-com');
            expect(firestore.doc('ryoikarashi-com').create).toHaveBeenCalledWith(httpTokenResponse);
            expect(firestore.doc('ryoikarashi-com').create).toHaveBeenCalledTimes(1);
            expect(firestore.doc('ryoikarashi-com').update).toHaveBeenCalledTimes(0);
        });

        it('updates an existing doc for tokens on firestore', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            jest.spyOn(admin, 'firestore').mockImplementation((): any => ({
                collection: jest.fn().mockReturnThis(),
                doc: jest.fn().mockReturnThis(),
                get: jest.fn(() => ({
                    data: jest.fn(() => httpTokenResponse),
                    exists: true,
                })),
                update: jest.fn(),
                create: jest.fn(),
            }));
            const firestore = admin.initializeApp().firestore();
            const repository = new GoogleTokenRepository(firestore);
            await repository.storeAccessTokenAndMaybeRefreshToken(token);

            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName('google_tokens'));
            expect(firestore.doc).toHaveBeenCalledWith('ryoikarashi-com');
            expect(firestore.doc('ryoikarashi-com').get).toHaveBeenCalledTimes(1);
            expect(firestore.doc('ryoikarashi-com').update).toHaveBeenLastCalledWith(httpTokenResponse);
            expect(firestore.doc('ryoikarashi-com').update).toHaveBeenCalledTimes(1);
            expect(firestore.doc('ryoikarashi-com').create).toHaveBeenCalledTimes(0);
        });
    });

    describe('getFirstToken', () => {
        it('returns a valid token', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            jest.spyOn(admin, 'firestore').mockImplementation((): any => ({
                collection: jest.fn().mockReturnThis(),
                doc: jest.fn().mockReturnThis(),
                get: jest.fn(() => ({
                    data: jest.fn(() => httpTokenResponse),
                    exists: true,
                })),
            }));
            const firestore = admin.initializeApp().firestore();
            const repository = new GoogleTokenRepository(firestore);

            await expect(repository.getFirstToken()).resolves.toEqual(token);
            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName('google_tokens'));
            expect(firestore.doc).toHaveBeenCalledWith('ryoikarashi-com');
            expect(firestore.doc('ryoikarashi-com').get).toHaveBeenCalledTimes(1);
        });

        it('returns an invalid token', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            jest.spyOn(admin, 'firestore').mockImplementation((): any => ({
                collection: jest.fn().mockReturnThis(),
                doc: jest.fn().mockReturnThis(),
                get: jest.fn(() => ({
                    data: jest.fn(() => httpTokenResponse),
                    exists: false,
                })),
            }));
            const firestore = admin.initializeApp().firestore();
            const repository = new GoogleTokenRepository(firestore);

            await expect(repository.getFirstToken()).resolves.toEqual(invalidToken);
            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName('google_tokens'));
            expect(firestore.doc).toHaveBeenCalledWith('ryoikarashi-com');
            expect(firestore.doc('ryoikarashi-com').get).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTokenByAuthorizationCode', () => {
        it('it has been called with appropriate params', async () => {
            const repository = new GoogleTokenRepository(admin.initializeApp().firestore());
            jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: httpTokenResponse });
            await repository.getTokenByAuthorizationCode(axios, oauthConfig);
            const tokenEndpoint = 'https://www.googleapis.com/oauth2/v4/token';
            const params = {
                code: oauthConfig.authorizationCode,
                client_id: oauthConfig.clientId,
                client_secret: oauthConfig.clientSecret,
                redirect_uri: oauthConfig.redirectUri,
                grant_type: 'authorization_code',
            };
            const requestConfig = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            };

            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith(tokenEndpoint, stringify(params), requestConfig);
        });

        it('returns a valid token', async () => {
            const repository = new GoogleTokenRepository(admin.initializeApp().firestore());
            jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: httpTokenResponse });

            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            await expect(repository.getTokenByAuthorizationCode(axios, oauthConfig)).resolves.toEqual(token);
        });

        it('throws an exception', async () => {
            const db = admin.initializeApp().firestore();
            const repository = new GoogleTokenRepository(db);
            jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error());

            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            await expect(repository.getTokenByAuthorizationCode(axios, oauthConfig)).rejects.toEqual(new Error());
        });
    });

    describe('refreshToken', () => {
        const newHttpTokenResponse = {
            access_token: 'new_access_token',
            refresh_token: 'new_refresh_token',
        };
        const newToken = new Token(
            AccessToken.of(newHttpTokenResponse.access_token),
            RefreshToken.of(newHttpTokenResponse.refresh_token),
        );

        it('it has been called with appropriate params', async () => {
            const params = {
                client_id: oauthConfig.clientId,
                client_secret: oauthConfig.clientSecret,
                grant_type: 'refresh_token',
                refresh_token: httpTokenResponse.refresh_token,
            };
            const requestConfig = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            };

            const repository = new GoogleTokenRepository(admin.initializeApp().firestore());
            jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: newHttpTokenResponse });
            await repository.refreshToken(axios, token, oauthConfig);
            const tokenEndpoint = 'https://www.googleapis.com/oauth2/v4/token';

            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(axios.post).toHaveBeenCalledWith(tokenEndpoint, stringify(params), requestConfig);
        });

        it('returns a new token', async () => {
            const repository = new GoogleTokenRepository(admin.initializeApp().firestore());
            jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: newHttpTokenResponse });
            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            await expect(repository.refreshToken(axios, token, oauthConfig)).resolves.toEqual(newToken);
        });

        it('throws an exception', async () => {
            const repository = new GoogleTokenRepository(admin.initializeApp().firestore());
            jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error());

            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            await expect(repository.refreshToken(axios, token, oauthConfig)).rejects.toEqual(new Error());
        });
    });
});
