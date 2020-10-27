import './index.html';
import './index.css';

import Pusher from 'pusher-js';
import axios, {AxiosResponse} from 'axios';
import isEqual from 'lodash.isequal';
import {TrackPlainObj} from "./functions-src/Domains/Track/Track";

let currentlyListening = {};
const ENDPOINT = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:9000';

const getCurrentlyPlaying = (): Promise<AxiosResponse> =>
    axios.get(`${ENDPOINT}/.netlify/functions/currently-playing`);

const updateDOM = (track: TrackPlainObj) => {
    const $spotifyElement = document.getElementById('spotify');
    if ($spotifyElement) {
        $spotifyElement.innerHTML = track && track?.artist && track?.link
            ? `<a href="${track.link}" target="_blank">♫ ${track.isPlaying ? 'Currently playing' : 'Recently played'}: ${track.name} - ${track.artist}</a>`
            : `♫ Nothing's playing right now. Check back later. :)`;
    }
};

const playClickSound = () => {
    const clickSound = document.getElementById('clickSound') as HTMLMediaElement;
    clickSound.muted = false;
    clickSound.volume = 0.05;
    Array.from(document.querySelectorAll('a')).map(item => {
        item.addEventListener('mouseenter', async () => {
            await clickSound.play();
        }, false);

        item.addEventListener('mouseleave', async () => {
            await clickSound.pause();
            clickSound.currentTime = 0;
        }, false);
    });
};

const getARandomPhoto = (): Promise<AxiosResponse> =>
    axios.get(`${ENDPOINT}/.netlify/functions/get-random-photo`);

const updateBg = (src: string) => {
    const $bg = document.getElementById('bg');
    if ($bg && src.length) {
        $bg.style.backgroundImage = `url(${src})`;
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const [{ data: trackData }, { data: { url } }] = await Promise.all([
        getCurrentlyPlaying(),
        getARandomPhoto(),
    ]);

    // update background image
    updateBg(url);

    // initially reflect a currently playing track
    currentlyListening = trackData;
    updateDOM(trackData);
    playClickSound();

    // initialize pusher
    const pusher = new Pusher('f3f5751318b2c7958521', {
        cluster: 'ap3'
    });

    // dynamically reflect a currently playing track
    const channel = pusher.subscribe('spotify');
    channel.bind('fetch-currently-listening-track', function(trackData: TrackPlainObj) {
        if (!isEqual(currentlyListening, trackData)) {
            updateDOM(trackData);
            currentlyListening = trackData;
        }
    });
});
