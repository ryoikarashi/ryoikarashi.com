import * as admin from 'firebase-admin';
import axios, { AxiosStatic } from 'axios';
import { HTTPTokenResponse, IOAuthConfig, ITokenRepository } from './ITokenRepository';
import { Token } from '../../Entities/Token/Token';
import { RefreshToken } from '../../Entities/Token/RefreshToken';
import { AccessToken } from '../../Entities/Token/AccessToken';
import { getRootCollectionName } from '../../../utils';

class GenericTokenRepository extends ITokenRepository {
    constructor(db: FirebaseFirestore.Firestore, collectionName: string, docPath: string) {
        super(db, collectionName, docPath);
    }
    getTokenByAuthorizationCode(http: AxiosStatic, config: IOAuthConfig): Promise<Token> {
        return Promise.resolve(new Token(AccessToken.of('dummy_access_token'), RefreshToken.of('dummy_refresh_token')));
    }
    refreshToken(http: AxiosStatic, expiredToken: Token, config: IOAuthConfig): Promise<Token> {
        return Promise.resolve(
            new Token(AccessToken.of('dummy_new_access_token'), RefreshToken.of('dummy_new_refresh_token')),
        );
    }
}

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

describe('Test GenericTokenRepository', () => {
    const collectionName = 'dummy-collection-name';
    const docPath = 'dummy-doc-path';

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
            const repository = new GenericTokenRepository(firestore, collectionName, docPath);
            await repository.storeAccessTokenAndMaybeRefreshToken(token);

            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName(collectionName));
            expect(firestore.doc).toHaveBeenCalledWith(docPath);
            expect(firestore.doc(docPath).create).toHaveBeenCalledWith(httpTokenResponse);
            expect(firestore.doc(docPath).create).toHaveBeenCalledTimes(1);
            expect(firestore.doc(docPath).update).toHaveBeenCalledTimes(0);
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
            const repository = new GenericTokenRepository(firestore, collectionName, docPath);
            await repository.storeAccessTokenAndMaybeRefreshToken(token);

            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName(collectionName));
            expect(firestore.doc).toHaveBeenCalledWith(docPath);
            expect(firestore.doc(docPath).get).toHaveBeenCalledTimes(1);
            expect(firestore.doc(docPath).update).toHaveBeenLastCalledWith(httpTokenResponse);
            expect(firestore.doc(docPath).update).toHaveBeenCalledTimes(1);
            expect(firestore.doc(docPath).create).toHaveBeenCalledTimes(0);
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
            const repository = new GenericTokenRepository(firestore, collectionName, docPath);

            await expect(repository.getFirstToken()).resolves.toEqual(token);
            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName(collectionName));
            expect(firestore.doc).toHaveBeenCalledWith(docPath);
            expect(firestore.doc(docPath).get).toHaveBeenCalledTimes(1);
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
            const repository = new GenericTokenRepository(firestore, collectionName, docPath);

            await expect(repository.getFirstToken()).resolves.toEqual(invalidToken);
            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName(collectionName));
            expect(firestore.doc).toHaveBeenCalledWith(docPath);
            expect(firestore.doc(docPath).get).toHaveBeenCalledTimes(1);
        });
    });
});
