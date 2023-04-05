import * as admin from 'firebase-admin';
import axios from 'axios';
import { SpotifyTrackRepository } from './SpotifyTrackRepository';
import { getRootCollectionName } from '../../../utils';
import { Track, TrackPlainObj } from '../../Entities/Track/Track';
import { Link, Name, Artist, IsPlaying, Explanation } from '../../Entities/Track/ValueObjects';
import { AccessToken } from '../../Entities/Token/ValueObjects';

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

afterEach(() => {
    jest.clearAllMocks();
});

describe('Test SpotifyTrackRepository', () => {
    const collectionName = 'spotify_last_listening_track';
    const docPath = 'ryoikarashi-com';

    const trackPlainObj: TrackPlainObj = {
        artists: ['artist'],
        isPlaying: false,
        link: 'https://example.com/track',
        name: 'track name',
        explanation: '',
    };

    const track = new Track(
        Name.of(trackPlainObj.name),
        trackPlainObj.artists.map((artist) => Artist.of(artist)),
        IsPlaying.of(trackPlainObj.isPlaying),
        Link.of(trackPlainObj.link),
        Explanation.of(trackPlainObj.explanation),
    );

    const invalidTrack = new Track(Name.of(null), [], IsPlaying.of(null), Link.of(null), Explanation.of(''));

    describe('storeLastPlayedTrack', () => {
        it('creates a new doc for track on firestore', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            jest.spyOn(admin, 'firestore').mockImplementation((): any => ({
                collection: jest.fn().mockReturnThis(),
                doc: jest.fn().mockReturnThis(),
                get: jest.fn(() => ({
                    data: jest.fn(() => ({})),
                    exists: false,
                })),
                update: jest.fn(),
                create: jest.fn(),
            }));
            const firestore = admin.initializeApp().firestore();
            const repository = new SpotifyTrackRepository(firestore, axios, collectionName, docPath);
            await repository.storeLastPlayedTrack(trackPlainObj);

            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName(collectionName));
            expect(firestore.doc).toHaveBeenCalledWith(docPath);
            expect(firestore.doc(docPath).get).toHaveBeenCalledTimes(1);
            expect(firestore.doc(docPath).create).toHaveBeenCalledWith(trackPlainObj);
            expect(firestore.doc(docPath).create).toHaveBeenCalledTimes(1);
            expect(firestore.doc(docPath).update).toHaveBeenCalledTimes(0);
        });

        it('updates an existing doc for track on firestore', async () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            jest.spyOn(admin, 'firestore').mockImplementation((): any => ({
                collection: jest.fn().mockReturnThis(),
                doc: jest.fn().mockReturnThis(),
                get: jest.fn(() => ({
                    data: jest.fn(() => trackPlainObj),
                    exists: true,
                })),
                update: jest.fn(),
                create: jest.fn(),
            }));
            const firestore = admin.initializeApp().firestore();
            const repository = new SpotifyTrackRepository(firestore, axios, collectionName, docPath);
            await repository.storeLastPlayedTrack(trackPlainObj);

            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName(collectionName));
            expect(firestore.doc).toHaveBeenCalledWith(docPath);
            expect(firestore.doc(docPath).get).toHaveBeenCalledTimes(1);
            expect(firestore.doc(docPath).create).toHaveBeenCalledTimes(0);
            expect(firestore.doc(docPath).update).toHaveBeenCalledWith(trackPlainObj);
            expect(firestore.doc(docPath).update).toHaveBeenCalledTimes(1);
        });
    });

    describe('getLastPlayedTrack', () => {
        it('returns a valid track', async () => {
            jest.spyOn(admin, 'firestore').mockImplementation((): any => ({
                collection: jest.fn().mockReturnThis(),
                doc: jest.fn().mockReturnThis(),
                get: jest.fn(() => ({
                    data: jest.fn(() => trackPlainObj),
                    exists: true,
                })),
                update: jest.fn(),
                create: jest.fn(),
            }));
            const firestore = admin.initializeApp().firestore();
            const repository = new SpotifyTrackRepository(firestore, axios, collectionName, docPath);
            await expect(repository.getLastPlayedTrack()).resolves.toEqual(track);
            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName(collectionName));
            expect(firestore.doc).toHaveBeenCalledWith(docPath);
            expect(firestore.doc(docPath).get).toHaveBeenCalledTimes(1);
        });

        it('returns an invalid track', async () => {
            jest.spyOn(admin, 'firestore').mockImplementation((): any => ({
                collection: jest.fn().mockReturnThis(),
                doc: jest.fn().mockReturnThis(),
                get: jest.fn(() => ({
                    data: jest.fn(() => ({})),
                    exists: false,
                })),
                update: jest.fn(),
                create: jest.fn(),
            }));
            const firestore = admin.initializeApp().firestore();
            const repository = new SpotifyTrackRepository(firestore, axios, collectionName, docPath);

            await expect(repository.getLastPlayedTrack()).resolves.toEqual(invalidTrack);
            expect(admin.initializeApp).toHaveBeenCalledTimes(1);
            expect(firestore.collection).toHaveBeenCalledWith(getRootCollectionName(collectionName));
            expect(firestore.doc).toHaveBeenCalledWith(docPath);
            expect(firestore.doc(docPath).get).toHaveBeenCalledTimes(1);
        });
    });

    describe('getCurrentlyListeningTrack', () => {
        const httpTrackResponse200 = {
            status: 200,
            data: {
                item: {
                    name: trackPlainObj.name,
                    artists: trackPlainObj.artists.map((artist) => ({ name: artist })),
                    external_urls: {
                        spotify: trackPlainObj.link,
                    },
                },
                is_playing: trackPlainObj.isPlaying,
            },
        };
        const httpTrackResponse204 = {
            status: 204,
            data: null,
        };
        const accessToken = AccessToken.of('access_token');
        const callback = async () => Promise.resolve(accessToken);

        beforeEach(() => {
            jest.spyOn(admin, 'firestore').mockImplementation((): any => ({
                collection: jest.fn().mockReturnThis(),
                doc: jest.fn().mockReturnThis(),
                get: jest.fn(() => ({
                    data: jest.fn(() => trackPlainObj),
                    exists: true,
                })),
                update: jest.fn(),
                create: jest.fn(),
            }));
        });

        it('sends a request to spotify for retrieving a currently listening track with appropriate params', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(httpTrackResponse200);
            const firestore = admin.initializeApp().firestore();
            const repository = new SpotifyTrackRepository(firestore, axios, collectionName, docPath);
            const requestConfig = {
                headers: {
                    Authorization: `Bearer ${accessToken.value()}`,
                },
            };
            const endpoint = 'https://api.spotify.com/v1/me/player/currently-playing';

            await expect(repository.getCurrentlyListeningTrack(accessToken, callback)).resolves.toEqual(track);
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith(endpoint, requestConfig);
            await expect(axios.get(endpoint, requestConfig)).resolves.toEqual(httpTrackResponse200);
        });

        it('returns a valid track', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(httpTrackResponse200);
            const firestore = admin.initializeApp().firestore();
            const repository = new SpotifyTrackRepository(firestore, axios, collectionName, docPath);

            await expect(repository.getCurrentlyListeningTrack(accessToken, callback)).resolves.toEqual(track);
        });

        it('returns a last played track', async () => {
            jest.spyOn(axios, 'get').mockResolvedValue(httpTrackResponse204);
            const firestore = admin.initializeApp().firestore();
            const repository = new SpotifyTrackRepository(firestore, axios, collectionName, docPath);

            await expect(repository.getCurrentlyListeningTrack(accessToken, callback)).resolves.toEqual(track);
        });

        it('refreshes a token and stores the track and returns a token', async () => {
            jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error()).mockResolvedValueOnce(httpTrackResponse200);
            const firestore = admin.initializeApp().firestore();
            const repository = new SpotifyTrackRepository(firestore, axios, collectionName, docPath);

            await expect(repository.getCurrentlyListeningTrack(accessToken, callback)).resolves.toEqual(track);
            expect(axios.get).toHaveBeenCalledTimes(2);
        });
    });
});
