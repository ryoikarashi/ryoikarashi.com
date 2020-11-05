import { TrackPlainObj } from '../../functions-src/Entities/Track/Track';
import { PhotoPlainObj } from '../../functions-src/Entities/Photo/Photo';
import imagesLoaded from 'imagesloaded';
import Photo from '../photo';
import Track from '../track';
import ClickSound from '../click-sound';
import defaultBg from '../../assets/bg.jpeg';
import { IPage } from './IPage';

export default class TopPage implements IPage {
    private readonly _photo: Photo;
    private readonly _track: Track;
    private readonly _clickSound: ClickSound;
    private _currentlyListeningTrack: TrackPlainObj;
    private readonly _trackElementId: string;
    private readonly _bgElementId: string;
    private readonly _loadingElementId: string;
    private readonly _contentElementId: string;

    constructor(
        photo: Photo,
        track: Track,
        clickSound: ClickSound,
        trackElementId: string,
        bgElementId: string,
        loadingElementId: string,
        contentElementId: string,
    ) {
        this._photo = photo;
        this._track = track;
        this._clickSound = clickSound;
        this._currentlyListeningTrack = {
            artist: '',
            isPlaying: false,
            link: '',
            name: '',
        };
        this._trackElementId = trackElementId;
        this._bgElementId = bgElementId;
        this._loadingElementId = loadingElementId;
        this._contentElementId = contentElementId;
    }

    private async setUpData() {
        const results = await Promise.allSettled([this._track.getCurrentlyPlaying(), this._photo.getARandomPhoto()]);

        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value.data;
            }

            if (index === 0) {
                return {
                    isPlaying: false,
                    link: '',
                    name: '',
                    artist: '',
                } as TrackPlainObj;
            }

            return {
                url: defaultBg,
            } as PhotoPlainObj;
        });
    }

    get currentlyListeningTrack(): TrackPlainObj {
        return this._currentlyListeningTrack;
    }

    set currentlyListeningTrack(track: TrackPlainObj) {
        this._currentlyListeningTrack = track;
    }

    public updateDOM(trackData: TrackPlainObj): void {
        this._currentlyListeningTrack = trackData;
        const $spotifyElement = document.getElementById(this._trackElementId);
        if ($spotifyElement) {
            $spotifyElement.innerHTML =
                trackData && trackData?.artist && trackData?.link
                    ? `<a href="${trackData.link}" target="_blank">♫ ${
                          trackData.isPlaying ? 'Currently playing' : 'Recently played'
                      }: ${trackData.name} - ${trackData.artist}</a>`
                    : `♫ Nothing's playing right now. Check back later. :)`;
        }
    }

    private _toggleContent() {
        const $loading = document.getElementById(this._loadingElementId);
        const $content = document.getElementById(this._contentElementId);
        if ($loading && $content) {
            $loading.style.display = 'none';
            $content.style.display = 'block';
        }
    }

    public async exec(): Promise<void> {
        const [trackData, photoData] = (await this.setUpData()) as [TrackPlainObj, PhotoPlainObj];

        // update background image
        this._photo.updateBg(photoData.url);

        // update dom
        this.updateDOM(trackData);

        // play click sound
        this._clickSound.playClickSound();

        // show main content when the background image is fully loaded
        imagesLoaded(`#${this._bgElementId}`, { background: true }, () => {
            // show main content
            this._toggleContent();
        });
    }
}
