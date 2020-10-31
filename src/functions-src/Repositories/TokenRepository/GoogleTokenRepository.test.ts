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

describe('Test GooglePhotosRepository', () => {
    const httpTokenResponse: HTTPTokenResponse = {
        access_token: 'access_token_1',
        refresh_token: 'refresh_token_1',
    };

    const token = new Token(
        AccessToken.of(httpTokenResponse.access_token),
        RefreshToken.of(httpTokenResponse.refresh_token),
    );

    // describe('storeAccessTokenAndMaybeRefreshToken', async () => {
    // });

    describe('getFirstToken', () => {
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

        it('returns a valid token', async () => {
            await expect(repository.getFirstToken()).resolves.toEqual(token);
            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName('google_tokens'));
            expect(firestore.doc).toHaveBeenCalledWith('ryoikarashi-com');
        });
    });

    describe('getTokenByAuthorizationCode', () => {
        const oauthConfig: IOAuthConfig = {
            authorizationCode: 'authorization_code',
            clientId: 'client_id',
            clientSecret: 'client_secret',
            redirectUri: 'https://example.com/callback',
        };

        it('returns a valid token', async () => {
            (axios as jest.Mocked<typeof axios>).post.mockResolvedValueOnce({ data: httpTokenResponse });
            const repository = new GoogleTokenRepository(admin.firestore());
            await expect(repository.getTokenByAuthorizationCode(axios, oauthConfig)).resolves.toEqual(token);
        });

        it('returns an invalid token', async () => {
            (axios as jest.Mocked<typeof axios>).post.mockRejectedValueOnce(new Error());
            const repository = new GoogleTokenRepository(admin.firestore());
            await expect(repository.getTokenByAuthorizationCode(axios, oauthConfig)).rejects.toEqual(new Error());
        });
    });

    // describe('refreshToken', () => {
    // });
});
