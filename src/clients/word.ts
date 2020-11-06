import axios, { AxiosResponse } from 'axios';
import { WordPlainObject } from '../functions-src/Entities/Word/Word';

export default class Word {
    public getARandomWord(): Promise<AxiosResponse<WordPlainObject>> {
        return axios.get<WordPlainObject>(`/.netlify/functions/get-random-pali-word`);
    }
}
