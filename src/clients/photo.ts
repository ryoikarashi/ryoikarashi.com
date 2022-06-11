import axios, { AxiosResponse } from 'axios';
import { PhotoPlainObj } from '../functions-src/Entities/Photo/Photo';

export default class Photo {
    private readonly _bgId: string;

    constructor(bgId: string) {
        this._bgId = bgId;
    }

    public async getARandomPhoto(): Promise<AxiosResponse<PhotoPlainObj>> {
        return axios.get<PhotoPlainObj>(`/.netlify/functions/get-random-photo`);
    }

    public setImage(src: string, width?: string, height?: string): void {
        const $bg = document.getElementById(this._bgId);
        if ($bg && src.length) {
            $bg.setAttribute('src', src);
            if (width) {
                $bg.setAttribute('width', width);
            }
            if (height) {
                $bg.setAttribute('height', height);
            }
        }
    }
}
