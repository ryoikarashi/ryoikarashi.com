import './index.html';
import './index.css';

import Pusher from 'pusher-js';
import axios, {AxiosResponse} from 'axios';
import isEqual from 'lodash.isequal';

let currentlyListening = {};
const ENDPOINT = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:9000';

const getCurrentlyPlaying = (): Promise<AxiosResponse> =>
    axios.get(`${ENDPOINT}/.netlify/functions/currently-playing`);

const updateDOM = (data: any) => {
    const $spotifyElement = document.getElementById('spotify');
    const track = data?.item?.name;
    const artist = data?.item?.artists[0]?.name;
    const trackUrl = data?.item?.external_urls?.spotify;
    const isPlaying = data?.is_playing;
    if ($spotifyElement) {
        $spotifyElement.innerHTML = track && artist && trackUrl
            ? `<a href="${trackUrl}" target="_blank">♫ ${isPlaying ? 'Currently playing' : 'Recently played'}: ${data.item.name} - ${artist}</a>`
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
        if (isEqual(currentlyListening, data)) {
            updateDOM(data);
        }
    });
});
