import './index.html';
import './index.css';

import axios, {AxiosResponse} from 'axios';

const ENDPOINT = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:9000';

const getCurrentlyPlaying = (): Promise<AxiosResponse> =>
    axios.get(`${ENDPOINT}/.netlify/functions/currently-playing`);

document.addEventListener('DOMContentLoaded', async () => {
    const { data } = await getCurrentlyPlaying();
    const $spotifyElement = document.getElementById('spotify');
    const track = data?.item?.name;
    const artist = data?.item?.artists[0]?.name;
    const trackUrl = data?.item?.external_urls?.spotify;
    const isPlaying = data?.is_playing;
    if ($spotifyElement) {
        $spotifyElement.innerHTML = track && artist && trackUrl
            ? `<a href="${trackUrl}" target="_blank">♫${isPlaying ? 'Currently' : 'Last'} playing: ${data.item.name} - ${artist}</a>`
            : `♫ Nothing's playing right now. Check back later. :)`;
    }
});
