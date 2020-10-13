import {Name} from "./Name";
import {Artist} from "./Artist";
import {Link} from "./Link";
import {IsPlaying} from "./IsPlaying";

export class Track {
    private readonly _name;
    private readonly _artist;
    private readonly _isPlaying;
    private readonly _link;

    constructor(name: Name, artist: Artist, isPlaying: IsPlaying, link: Link) {
        this._name = name;
        this._artist = artist;
        this._isPlaying = isPlaying;
        this._link = link;
    }

    public name(): Name {
        return this._name;
    }

    public artist(): Artist {
        return this._artist;
    }

    public isPlaying(): IsPlaying {
        return this._isPlaying;
    }

    public link(): Link {
        return this._link;
    }
}
