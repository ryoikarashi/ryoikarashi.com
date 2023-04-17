import { Name, Artist, Link, IsPlaying, Explanation } from './ValueObjects';
import { IDomain } from '../IDomain';

export type SpotifyTrackType = 'track' | 'episode' | 'ad' | 'unknown';

export interface SpotifyTrack {
  item: {
    name: string;
    artists: [
      {
        name: string;
      }
    ];
    external_urls: {
      spotify: string;
    };
  };
  currently_playing_type: SpotifyTrackType;
  is_playing: boolean;
}

export interface TrackPlainObj {
  name: string;
  artists: string[];
  isPlaying: boolean;
  link: string;
  explanation: string;
}

export class Track implements IDomain<TrackPlainObj> {
  private readonly _name;
  private readonly _artists;
  private _isPlaying;
  private readonly _link;
  private _explanation;

  public static DEFAULT_PLAIN_OBJ: TrackPlainObj = {
    name: '',
    artists: [],
    isPlaying: false,
    link: '',
    explanation: '',
  };

  constructor(
    name: Name,
    artists: Artist[],
    isPlaying: IsPlaying,
    link: Link,
    explanation: Explanation
  ) {
    this._name = name;
    this._artists = artists;
    this._isPlaying = isPlaying;
    this._link = link;
    this._explanation = explanation;
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

  public get explanation(): Explanation {
    return this._explanation;
  }

  public set explanation(explanation: Explanation) {
    this._explanation = explanation;
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
      explanation: this._explanation.value(),
    };
  }

  toJson(): string {
    return JSON.stringify(this.toPlainObj());
  }

  toDefaultPlainObj(): TrackPlainObj {
    return {
      name: '',
      artists: [],
      isPlaying: false,
      link: '',
      explanation: '',
    };
  }
}
