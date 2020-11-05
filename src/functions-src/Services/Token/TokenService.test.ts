import admin from 'firebase-admin';
import axios, { AxiosStatic } from 'axios';
import { TokenService } from './TokenService';
import { IOAuthConfig, ITokenRepository } from '../../Repositories/TokenRepository/ITokenRepository';
import { Token } from '../../Entities/Token/Token';
import { AccessToken } from '../../Entities/Token/AccessToken';
import { RefreshToken } from '../../Entities/Token/RefreshToken';

// valid token
const accessToken = AccessToken.of('access_token');
const refreshToken = RefreshToken.of('refresh_token');
const token = new Token(accessToken, refreshToken);

// newly issued token
const newAccessToken = AccessToken.of('new_access_token');
const newRefreshToken = RefreshToken.of('new_refresh_token');
const newToken = new Token(newAccessToken, newRefreshToken);

// invalid token
const invalidAccessToken = AccessToken.of(null);
const invalidRefreshToken = RefreshToken.of(null);
const invalidToken = new Token(invalidAccessToken, invalidRefreshToken);

class MockTokenRepository extends ITokenRepository {
    async getFirstToken(): Promise<Token> {
        return Promise.resolve(token);
    }
    async storeAccessTokenAndMaybeRefreshToken(token: Token): Promise<void> {
        Promise.resolve();
    }
    async getTokenByAuthorizationCode(http: AxiosStatic, config: IOAuthConfig): Promise<Token> {
        return Promise.resolve(newToken);
    }
    async refreshToken(http: AxiosStatic, expiredToken: Token, config: IOAuthConfig): Promise<Token> {
        return Promise.resolve(newToken);
    }
}

const oauthConfig: IOAuthConfig = {
    authorizationCode: '',
    clientId: '',
    clientSecret: '',
    redirectUri: '',
};

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

// clear all mocks
afterEach(() => {
    jest.clearAllMocks();
});

describe('Test TokenService', () => {
    describe('getAccessAndRefreshToken', () => {
        it('returns an existing token', async () => {
            const MockTokenRepositoryInstance = new MockTokenRepository(
                admin.initializeApp().firestore(),
                'test',
                'test',
            );
            const service = new TokenService(axios, MockTokenRepositoryInstance, oauthConfig);

            const mockGetFirstToken = jest.fn().mockResolvedValueOnce(token);
            const mockGetTokenByAuthorizationCode = jest.fn().mockResolvedValueOnce(newToken);
            jest.spyOn(MockTokenRepositoryInstance, 'getFirstToken').mockImplementationOnce(mockGetFirstToken);
            jest.spyOn(MockTokenRepositoryInstance, 'getTokenByAuthorizationCode').mockImplementationOnce(
                mockGetTokenByAuthorizationCode,
            );

            await expect(service.getAccessAndRefreshToken()).resolves.toEqual(token);
            expect(mockGetFirstToken).toHaveBeenCalledTimes(1);
            expect(mockGetTokenByAuthorizationCode).toHaveBeenCalledTimes(0);
        });

        it('returns a newly issued token', async () => {
            const MockTokenRepositoryInstance = new MockTokenRepository(
                admin.initializeApp().firestore(),
                'test',
                'test',
            );
            const service = new TokenService(axios, MockTokenRepositoryInstance, oauthConfig);

            const mockGetFirstToken = jest.fn().mockResolvedValueOnce(invalidToken);
            const mockGetTokenByAuthorizationCode = jest.fn().mockResolvedValueOnce(newToken);
            const mockStoreAccessTokenAndMaybeRefreshToken = jest.fn();
            jest.spyOn(MockTokenRepositoryInstance, 'getFirstToken').mockImplementationOnce(mockGetFirstToken);
            jest.spyOn(MockTokenRepositoryInstance, 'getTokenByAuthorizationCode').mockImplementationOnce(
                mockGetTokenByAuthorizationCode,
            );
            jest.spyOn(MockTokenRepositoryInstance, 'storeAccessTokenAndMaybeRefreshToken').mockImplementationOnce(
                mockStoreAccessTokenAndMaybeRefreshToken,
            );

            await expect(service.getAccessAndRefreshToken()).resolves.toEqual(newToken);
            expect(mockGetFirstToken).toHaveBeenCalledTimes(1);
            expect(mockGetTokenByAuthorizationCode).toHaveBeenCalledTimes(1);
            expect(mockGetTokenByAuthorizationCode).toHaveBeenCalledWith(axios, oauthConfig);
            expect(mockStoreAccessTokenAndMaybeRefreshToken).toHaveBeenCalledTimes(1);
            expect(mockStoreAccessTokenAndMaybeRefreshToken).toHaveBeenCalledWith(newToken);
        });

        it('returns an invalid token due to an exception', async () => {
            const MockTokenRepositoryInstance = new MockTokenRepository(
                admin.initializeApp().firestore(),
                'test',
                'test',
            );
            const service = new TokenService(axios, MockTokenRepositoryInstance, oauthConfig);
            const mockGetFirstToken = jest.fn().mockRejectedValueOnce(new Error());
            jest.spyOn(MockTokenRepositoryInstance, 'getFirstToken').mockImplementationOnce(mockGetFirstToken);

            await expect(service.getAccessAndRefreshToken()).resolves.toEqual(invalidToken);
        });
    });

    describe('refreshAccessToken', () => {
        it('it returns a new token', async () => {
            const MockTokenRepositoryInstance = new MockTokenRepository(
                admin.initializeApp().firestore(),
                'test',
                'test',
            );
            const service = new TokenService(axios, MockTokenRepositoryInstance, oauthConfig);
            const mockGetFirstToken = jest.fn().mockResolvedValueOnce(token);
            const mockRefreshToken = jest.fn().mockResolvedValueOnce(newToken);
            const mockStoreAccessTokenAndMaybeRefreshToken = jest.fn();
            jest.spyOn(MockTokenRepositoryInstance, 'getFirstToken').mockImplementationOnce(mockGetFirstToken);
            jest.spyOn(MockTokenRepositoryInstance, 'refreshToken').mockImplementationOnce(mockRefreshToken);
            jest.spyOn(MockTokenRepositoryInstance, 'storeAccessTokenAndMaybeRefreshToken').mockImplementationOnce(
                mockStoreAccessTokenAndMaybeRefreshToken,
            );

            await expect(service.refreshAccessToken()).resolves.toEqual(newToken.accessToken);
            expect(mockGetFirstToken).toHaveBeenCalledTimes(1);
            expect(mockGetFirstToken).toHaveBeenCalledWith();
            expect(mockRefreshToken).toHaveBeenCalledTimes(1);
            expect(mockRefreshToken).toHaveBeenCalledWith(axios, token, oauthConfig);
            expect(mockStoreAccessTokenAndMaybeRefreshToken).toHaveBeenCalledTimes(1);
            expect(mockStoreAccessTokenAndMaybeRefreshToken).toHaveBeenCalledWith(newToken);
        });
    });
});
