import axios, { AxiosResponse } from 'axios';
import { GiphyPlainObj } from '../functions-src/Entities/Giphy/Giphy';

export default class Giphy {
    public getRandom(): Promise<AxiosResponse<GiphyPlainObj>> {
        return axios.get<GiphyPlainObj>(`/.netlify/functions/get-random-gif`);
    }
}
