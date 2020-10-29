import { Name } from './Name';
import { Artist } from './Artist';
import { Link } from './Link';
import { IsPlaying } from './IsPlaying';
import { IDomain } from '../IDomain';

export interface TrackPlainObj {
    name: string;
    artist: string;
    isPlaying: boolean;
    link: string;
}

export class Track implements IDomain<TrackPlainObj> {
    private readonly _name;
    private readonly _artist;
    private _isPlaying;
    private readonly _link;

    constructor(name: Name, artist: Artist, isPlaying: IsPlaying, link: Link) {
        this._name = name;
        this._artist = artist;
        this._isPlaying = isPlaying;
        this._link = link;
    }

    public get name(): Name {
        return this._name;
    }

    public get artist(): Artist {
        return this._artist;
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
            artist: this._artist.value(),
            isPlaying: this._isPlaying.value(),
            link: this._link.value(),
        };
    }

    toJson(): string {
        return JSON.stringify(this.toPlainObj());
    }
}
