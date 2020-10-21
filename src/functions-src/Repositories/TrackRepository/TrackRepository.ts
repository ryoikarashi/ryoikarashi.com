import * as admin from "firebase-admin";
import {ITrackRepository} from "./ITtrackRepository";
import {Track, TrackPlainObj} from "../../Domains/Track/Track";
import {Name} from "../../Domains/Track/Name";
import {Artist} from "../../Domains/Track/Artist";
import {IsPlaying} from "../../Domains/Track/IsPlaying";
import {Link} from "../../Domains/Track/Link";
import {getRootCollectionName} from "../../../utils";
import {AccessToken} from "../../Domains/Token/AccessToken";
import {AxiosStatic} from "axios";

export class TrackRepository implements ITrackRepository {
    private readonly _ref: admin.firestore.DocumentReference<FirebaseFirestore.DocumentData>;
    private readonly _http: AxiosStatic;
    private readonly _collectionName = 'spotify_last_listening_track';

    constructor(db: FirebaseFirestore.Firestore, http: AxiosStatic) {
        this._ref = db
            .collection(getRootCollectionName(this._collectionName))
            .doc('ryoikarashi-com');
        this._http = http;
    }

    public async storeLastPlayedTrack(data: TrackPlainObj): Promise<void> {
        const doc = await this._ref.get();
        doc.exists && (await this._ref.update(data)) || (await this._ref.create(data));
    }

    public async getLastPlayedTrack(): Promise<Track> {
        const doc = await this._ref.get();
        if (!doc.exists) {
            return new Track(
                Name.of(null),
                Artist.of(null),
                IsPlaying.of(null),
                Link.of(null),
            );
        }

        const data = doc.data() as TrackPlainObj;
        const track = new Track(
            Name.of(data?.name || null),
            Artist.of(data?.artist || null),
            IsPlaying.of(data?.isPlaying || false),
            Link.of(data?.link || null),
        );

        return Promise.resolve(track);
    }

    public async getCurrentlyListeningTrack(accessToken: AccessToken, callback: () => Promise<AccessToken>): Promise<Track> {
        try {
            const options = {
                "headers": { "Authorization": `Bearer  ${accessToken.value()}` },
            };
            const { status, data } =
                await this._http.get("https://api.spotify.com/v1/me/player/currently-playing", options);

            switch (status) {
                // when listening to a track on spotify
                case 200: {
                    const track = new Track(
                        Name.of(data?.item?.name),
                        Artist.of(data?.item?.artists[0]?.name),
                        IsPlaying.of(data?.is_playing),
                        Link.of(data?.item?.external_urls?.spotify),
                    );
                    await this.storeLastPlayedTrack(track.toPlainObj());
                    return track;
                }

                // when nothing's playing
                default: {
                    return await this.getLastPlayedTrack();
                }
            }
        } catch(e) {
            // when having an expired access token (unauthorized request)
            const accessToken = await callback();
            return await this.getCurrentlyListeningTrack(accessToken, callback);
        }
    }
}
