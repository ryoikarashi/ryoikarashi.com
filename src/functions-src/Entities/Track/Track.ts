import { Name } from './Name';
import { Artist } from './Artist';
import { Link } from './Link';
import { IsPlaying } from './IsPlaying';
import { IDomain } from '../IDomain';

export interface SpotifyTrack {
    item: {
        name: string;
        artists: [
            {
                name: string;
            },
        ];
        external_urls: {
            spotify: string;
        };
    };
    is_playing: boolean;
}

export interface TrackPlainObj {
    name: string;
    artists: string[];
    isPlaying: boolean;
    link: string;
}

export class Track implements IDomain<TrackPlainObj> {
    private readonly _name;
    private readonly _artists;
    private _isPlaying;
    private readonly _link;

    constructor(name: Name, artists: Artist[], isPlaying: IsPlaying, link: Link) {
        this._name = name;
        this._artists = artists;
        this._isPlaying = isPlaying;
        this._link = link;
    }

    public get name(): Name {
        return this._name;
    }

    public get artists(): Artist[] {
        return this._artists;
    }

    public get isPlaying(): IsPlaying {
        return this._isPlaying;
    }

    public set isPlaying(isPlaying: IsPlaying) {
        this._isPlaying = isPlaying;
    }

    public get link(): Link {
        return this._link;
    }

    isValid(): boolean {
        return this._name.value() !== null && !!this._name.value().length;
    }

    toPlainObj(): TrackPlainObj {
        return {
            name: this._name.value(),
            artists: this._artists.map((artist) => artist.value()),
            isPlaying: this._isPlaying.value(),
            link: this._link.value(),
        };
    }

    toJson(): string {
        return JSON.stringify(this.toPlainObj());
    }
}
