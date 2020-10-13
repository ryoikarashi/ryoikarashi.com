import './index.html';
import './index.css';

import Pusher from 'pusher-js';
import axios, {AxiosResponse} from 'axios';

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
    updateDOM(data);

    const pusher = new Pusher('f3f5751318b2c7958521', {
        cluster: 'ap3'
    });

    const channel = pusher.subscribe('fetch-currently-listening-track');
    channel.bind('my-event', function(data: any) {
        alert(JSON.stringify(data));
    });
});
