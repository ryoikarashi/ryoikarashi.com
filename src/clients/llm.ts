import axios, { AxiosResponse } from 'axios';
import { LLMPlainObject } from '../functions-src/Entities/LLM/LLM';

export default class LLM {
    public getCompletion(): Promise<AxiosResponse<LLMPlainObject>> {
        return axios.get<LLMPlainObject>(`/.netlify/functions/get-completion`);
    }
}
