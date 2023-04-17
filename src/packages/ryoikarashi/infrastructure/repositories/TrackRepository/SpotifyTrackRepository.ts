import { AxiosResponse, AxiosStatic } from 'axios';
import * as admin from 'firebase-admin';
import { ITrackRepository } from './ITtrackRepository';
import {
  SpotifyTrack,
  Track,
  TrackPlainObj,
} from '@/packages/ryoikarashi/domain/models/Track/Track';
import {
  Name,
  Artist,
  IsPlaying,
  Link,
  Explanation,
} from '@/packages/ryoikarashi/domain/models/Track/ValueObjects';
import { AccessToken } from '@/packages/ryoikarashi/domain/models/Token/ValueObjects';
import { getRootCollectionName } from '@/utils';

export class SpotifyTrackRepository implements ITrackRepository {
  private readonly _db: FirebaseFirestore.Firestore;
  private readonly _http: AxiosStatic;
  private readonly _collectionName: string;
  private readonly _docPath: string;
  private readonly _ref: admin.firestore.DocumentReference<FirebaseFirestore.DocumentData>;

  constructor(
    db: FirebaseFirestore.Firestore,
    http: AxiosStatic,
    collectionName: string,
    docPath: string
  ) {
    this._db = db;
    this._http = http;
    this._collectionName = collectionName;
    this._docPath = docPath;
    this._ref = db
      .collection(getRootCollectionName(collectionName))
      .doc(docPath);
  }

  public async storeLastPlayedTrack(data: TrackPlainObj): Promise<void> {
    const doc = await this._ref.get();
    // @ts-ignore
    doc.exists ? await this._ref.update(data) : await this._ref.create(data);
  }

  public async getLastPlayedTrack(): Promise<Track> {
    const doc = await this._ref.get();
    if (!doc.exists) {
      return new Track(
        Name.of(null),
        [],
        IsPlaying.of(null),
        Link.of(null),
        Explanation.of('')
      );
    }

    const data = doc.data() as TrackPlainObj;

    const track = new Track(
      Name.of(data?.name || null),
      data?.artists.map((artist) => Artist.of(artist)),
      IsPlaying.of(false),
      Link.of(data?.link || null),
      Explanation.of(data?.explanation || '')
    );

    return Promise.resolve(track);
  }

  public async getCurrentlyListeningTrack(
    accessToken: AccessToken,
    callback: () => Promise<AccessToken>
  ): Promise<Track> {
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${accessToken.value()}`,
        },
      };

      const { status, data } = await this._http.get<
        null,
        AxiosResponse<SpotifyTrack>
      >('https://api.spotify.com/v1/me/player/currently-playing', options);

      switch (status) {
        // when listening to a track on spotify
        case 200: {
          if (data.currently_playing_type !== 'track') {
            return this.getLastPlayedTrack();
          }

          const track = new Track(
            Name.of(data?.item?.name),
            data?.item?.artists.map((artist) => Artist.of(artist.name)),
            IsPlaying.of(data?.is_playing),
            Link.of(data?.item?.external_urls?.spotify),
            Explanation.of('')
          );
          await this.storeLastPlayedTrack(track.toPlainObj());
          return track;
        }

        // when nothing's playing
        default: {
          return await this.getLastPlayedTrack();
        }
      }
    } catch (e) {
      // when having an expired access token (unauthorized request)
      const accessToken = await callback();
      return await this.getCurrentlyListeningTrack(accessToken, callback);
    }
  }
}
