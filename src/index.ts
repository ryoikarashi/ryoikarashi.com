import './index.html';
import './index.css';

import Pusher from 'pusher-js';
import axios, {AxiosResponse} from 'axios';
import isEqual from 'lodash.isequal';
import {Track} from "./functions-src/Domains/Track/Track";

let currentlyListening = {};
const ENDPOINT = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:9000';

const getCurrentlyPlaying = (): Promise<AxiosResponse> =>
    axios.get(`${ENDPOINT}/.netlify/functions/currently-playing`);

const updateDOM = (track: Track) => {
    const $spotifyElement = document.getElementById('spotify');
    if ($spotifyElement) {
        $spotifyElement.innerHTML = track && track?.artist && track?.link
            ? `<a href="${track.link}" target="_blank">♫ ${track.isPlaying ? 'Currently playing' : 'Recently played'}: ${track.name} - ${track.artist}</a>`
            : `♫ Nothing's playing right now. Check back later. :)`;
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const { data } = await getCurrentlyPlaying();
    currentlyListening = data;
    updateDOM(data);

    const pusher = new Pusher('f3f5751318b2c7958521', {
        cluster: 'ap3'
    });

    const channel = pusher.subscribe('spotify');
    channel.bind('fetch-currently-listening-track', function(data: any) {
        if (!isEqual(currentlyListening, data)) {
            updateDOM(data);
            currentlyListening = data;
        }
    });
});
