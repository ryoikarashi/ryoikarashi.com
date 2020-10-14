import * as admin from "firebase-admin";
import {ITrackRepository} from "./ITtrackRepository";
import {ISpotifyCurrentlyListeningTrackData} from "../../Services/Spotify/ISpotifyCurrentlyListeningTrackData";
import {Track} from "../../Domains/Track/Track";
import {Name} from "../../Domains/Track/Name";
import {Artist} from "../../Domains/Track/Artist";
import {IsPlaying} from "../../Domains/Track/IsPlaying";
import {Link} from "../../Domains/Track/Link";

export class TrackRepository implements ITrackRepository {
    private readonly ref: admin.firestore.DocumentReference<FirebaseFirestore.DocumentData>;

    constructor(db: FirebaseFirestore.Firestore) {
        this.ref = db.collection('spotify_last_listening_track').doc('ryoikarashi-com');
    }

    async storeLastPlayedTrack(data: ISpotifyCurrentlyListeningTrackData): Promise<void> {
        const doc = await this.ref.get();
        doc.exists && (await this.ref.update(data)) || (await this.ref.create(data));
    }

    async exists(): Promise<boolean> {
        const doc = await this.ref.get();
        return doc.exists;
    }

    async getLastPlayedTrack(): Promise<Track> {
        const doc = await this.ref.get();
        if (!doc.exists) {
            return new Track(
                Name.of(null),
                Artist.of(null),
                IsPlaying.of(null),
                Link.of(null),
            );
        }

        const data = doc.data();
        const track = new Track(
            Name.of(data?.item?.name),
            Artist.of(data?.item?.artists[0]?.name),
            IsPlaying.of(data?.is_playing),
            Link.of(data?.item?.external_urls?.spotify),
        );
        return Promise.resolve(track);
    }
}
