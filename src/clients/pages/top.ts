import imagesLoaded from 'imagesloaded';
import { IPage } from './IPage';
import { TrackPlainObj } from '../../functions-src/Entities/Track/Track';
import { PhotoPlainObj } from '../../functions-src/Entities/Photo/Photo';
import { WordPlainObject } from '../../functions-src/Entities/Word/Word';
import { GiphyPlainObj } from '../../functions-src/Entities/Giphy/Giphy';
import DarkMode from '../darkMode';
import Giphy from '../giphy';
import Photo from '../photo';
import Track from '../track';
import ClickSound from '../click-sound';
import Word from '../word';
import { sleep } from '../../utils';
import defaultBg from '../../assets/bg.jpeg';

export default class TopPage implements IPage {
    private readonly _darkMode: DarkMode;
    private readonly _giphy: Giphy;
    private readonly _photo: Photo;
    private readonly _track: Track;
    private readonly _clickSound: ClickSound;
    private readonly _word: Word;
    private _currentlyListeningTrack: TrackPlainObj;
    private readonly _trackElementId: string;
    private readonly _bgElementId: string;
    private readonly _loadingElementId: string;
    private readonly _contentElementId: string;
    private readonly _wordElementId: string;

    constructor(
        darkMode: DarkMode,
        giphy: Giphy,
        photo: Photo,
        track: Track,
        word: Word,
        clickSound: ClickSound,
        trackElementId: string,
        bgElementId: string,
        loadingElementId: string,
        contentElementId: string,
        wordElementId: string,
    ) {
        this._darkMode = darkMode;
        this._giphy = giphy;
        this._photo = photo;
        this._track = track;
        this._clickSound = clickSound;
        this._word = word;
        this._currentlyListeningTrack = {
            artists: [],
            isPlaying: false,
            link: '',
            name: '',
        };
        this._trackElementId = trackElementId;
        this._bgElementId = bgElementId;
        this._loadingElementId = loadingElementId;
        this._contentElementId = contentElementId;
        this._wordElementId = wordElementId;
    }

    private async setUpData() {
        const results = await Promise.allSettled([
            this._giphy.getRandom(),
            this._track.getCurrentlyPlaying(),
            this._photo.getARandomPhoto(),
            this._word.getARandomWord(),
        ]);

        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value.data;
            }

            if (index === 0) {
                return {
                    isPlaying: false,
                    link: '',
                    name: '',
                    artists: [],
                } as TrackPlainObj;
            }

            if (index === 2) {
                return {
                    url: defaultBg,
                    width: '1200',
                    height: '1200',
                } as PhotoPlainObj;
            }

            return {
                name: 'anicca',
                chapter: 'a',
                explanation: 'Inconstant; unsteady; impermanent.',
            } as WordPlainObject;
        });
    }

    get currentlyListeningTrack(): TrackPlainObj {
        return this._currentlyListeningTrack;
    }

    set currentlyListeningTrack(track: TrackPlainObj) {
        this._currentlyListeningTrack = track;
    }

    public updateTrackDOM(trackData: TrackPlainObj): void {
        this._currentlyListeningTrack = trackData;
        const $spotifyElement = document.getElementById(this._trackElementId);
        if ($spotifyElement) {
            $spotifyElement.innerHTML =
                trackData && trackData.artists.length && trackData?.link
                    ? `<a href="${trackData.link}" target="_blank" class="leading-4">♫ ${
                          trackData.isPlaying ? 'Currently playing' : 'Recently played'
                      }: ${trackData.name} - ${trackData.artists.join(', ')}</a>`
                    : `♫ Nothing's playing right now. Check back later. :)`;
        }
    }

    public updateWordDOM(wordData: WordPlainObject): void {
        const $wordElement = document.getElementById(this._wordElementId);
        if (!$wordElement) return;

        const $nameElement = $wordElement.querySelector('#name');
        const $explanationElement = $wordElement.querySelector('#explanation');
        if (!$nameElement || !$explanationElement) return;

        $nameElement.innerHTML = wordData?.name || 'anicca';
        $explanationElement.innerHTML = wordData?.explanation || 'Inconstant; unsteady; impermanent.';
    }

    private _toggleContent() {
        const $loading = document.getElementById(this._loadingElementId);
        const $content = document.getElementById(this._contentElementId);
        if ($loading && $content) {
            $loading.style.display = 'none';
            $content.style.display = 'block';
        }
    }

    private _toggleWord() {
        const $name = document.getElementById('name');
        const $explanationOverlay = document.getElementById('explanation_overlay');
        const $explanation = document.getElementById('explanation');
        if (!$explanationOverlay || !$explanation || !$name) return;

        $name.addEventListener('click', async () => {
            $explanationOverlay.classList.toggle('invisible');
            $explanation.classList.toggle('invisible');
            $explanationOverlay.classList.toggle('fade-in');
            $explanationOverlay.classList.toggle('fade-out');
            $explanation.classList.toggle('fade-in');
            $explanation.classList.toggle('fade-out');
            TopPage._toggleFilteringWrapper();
        });

        $explanationOverlay.addEventListener('click', async () => {
            $explanationOverlay.classList.toggle('fade-in');
            $explanationOverlay.classList.toggle('fade-out');
            $explanation.classList.toggle('fade-in');
            $explanation.classList.toggle('fade-out');
            TopPage._toggleFilteringWrapper();
            await sleep(500);
            $explanationOverlay.classList.toggle('invisible');
            $explanation.classList.toggle('invisible');
        });
    }

    private static _toggleFilteringWrapper(): void {
        const $wrapper = document.getElementById('wrapper');
        const $about = document.getElementById('about');
        if (!$wrapper || !$about) return;
        $wrapper.classList.toggle('filtered');
        $about.classList.toggle('filtered');
    }

    private static isRoot(): boolean {
        return (location.pathname?.match(/(\/|(\/index(|(.html))))$/gm)?.length ?? 0) > 0;
    }

    public async exec(): Promise<void> {
        // init dark mode
        this._darkMode.init();

        // setup each data
        const [giphyData, trackData, photoData, wordData] = (await this.setUpData()) as [
            GiphyPlainObj,
            TrackPlainObj,
            PhotoPlainObj,
            WordPlainObject,
        ];

        // update background image
        if (TopPage.isRoot()) {
            console.log('giphyData', giphyData);
            console.log('trackData', trackData);
            console.log('photoData', photoData);
            console.log('wordData', wordData);
            this._photo.setImage(photoData.url, photoData.width, photoData.height);
        } else {
            this._photo.setImage(giphyData.src);
        }

        // update dom
        this.updateTrackDOM(trackData);
        this.updateWordDOM(wordData);

        this._toggleWord();

        // play click sound
        this._clickSound.playClickSound();

        // show main content when the background image is fully loaded
        imagesLoaded(`#${this._bgElementId}`, { background: true }, () => {
            // show main content
            this._toggleContent();
        });
    }
}
