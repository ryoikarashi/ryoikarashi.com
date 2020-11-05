import axios, { AxiosResponse } from 'axios';
import { TrackPlainObj } from '../functions-src/Entities/Track/Track';

export default class Track {
    public getCurrentlyPlaying(): Promise<AxiosResponse<TrackPlainObj>> {
        return axios.get<TrackPlainObj>(`/.netlify/functions/currently-playing`);
    }
}
