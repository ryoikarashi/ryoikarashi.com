import * as admin from 'firebase-admin';
import axios from 'axios';
import { GoogleTokenRepository } from './GoogleTokenRepository';
import { HTTPTokenResponse, IOAuthConfig } from './ITokenRepository';
import { Token } from '../../Entities/Token/Token';
import { RefreshToken } from '../../Entities/Token/RefreshToken';
import { AccessToken } from '../../Entities/Token/AccessToken';
import { getRootCollectionName } from '../../../utils';

// create mocks
jest.mock('axios');
jest.mock('firebase-admin', () => ({
    initializeApp: jest.fn().mockReturnThis(),
    firestore: jest.fn(),
}));

// clear all mocks before each test
afterEach(() => {
    jest.clearAllMocks();
});

const oauthConfig: IOAuthConfig = {
    authorizationCode: 'authorization_code',
    clientId: 'client_id',
    clientSecret: 'client_secret',
    redirectUri: 'https://example.com/callback',
};

describe('Test GooglePhotosRepository', () => {
    const httpTokenResponse: HTTPTokenResponse = {
        access_token: 'access_token_1',
        refresh_token: 'refresh_token_1',
    };

    const token = new Token(
        AccessToken.of(httpTokenResponse.access_token),
        RefreshToken.of(httpTokenResponse.refresh_token),
    );

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

            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName('google_tokens'));
            expect(firestore.doc).toHaveBeenCalledWith('ryoikarashi-com');
            expect(firestore.collection('ryoikarashi-com').doc().create).toHaveBeenCalledWith(httpTokenResponse);
            expect(firestore.collection('ryoikarashi-com').doc().create).toHaveBeenCalledTimes(1);
            expect(firestore.collection('ryoikarashi-com').doc().update).toHaveBeenCalledTimes(0);
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

            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName('google_tokens'));
            expect(firestore.doc).toHaveBeenCalledWith('ryoikarashi-com');
            expect(firestore.collection('ryoikarashi-com').doc().update).toHaveBeenLastCalledWith(httpTokenResponse);
            expect(firestore.collection('ryoikarashi-com').doc().update).toHaveBeenCalledTimes(1);
            // TODO: reset mocks
            // expect(firestore.collection('ryoikarashi-com').doc().create).toHaveBeenCalledTimes(0);
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
                    exists: jest.fn().mockResolvedValue(true),
                })),
            }));
            const firestore = admin.initializeApp().firestore();
            const repository = new GoogleTokenRepository(firestore);
            await expect(repository.getFirstToken()).resolves.toEqual(token);

            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName('google_tokens'));
            expect(firestore.doc).toHaveBeenCalledWith('ryoikarashi-com');
        });
    });

    describe('getTokenByAuthorizationCode', () => {
        it('returns a valid token', async () => {
            const repository = new GoogleTokenRepository(admin.firestore());
            jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: httpTokenResponse });
            await expect(repository.getTokenByAuthorizationCode(axios, oauthConfig)).resolves.toEqual(token);
        });

        it('throws an exception', async () => {
            const repository = new GoogleTokenRepository(admin.firestore());
            jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error());
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

        it('returns a new token', async () => {
            const repository = new GoogleTokenRepository(admin.firestore());
            jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: newHttpTokenResponse });
            await expect(repository.refreshToken(axios, token, oauthConfig)).resolves.toEqual(newToken);
        });

        it('throws an exception', async () => {
            const repository = new GoogleTokenRepository(admin.firestore());
            jest.spyOn(axios, 'post').mockRejectedValueOnce(new Error());
            await expect(repository.refreshToken(axios, token, oauthConfig)).rejects.toEqual(new Error());
        });
    });
});
