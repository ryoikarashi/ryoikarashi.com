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

    public setBackgroundImage(src: string): void {
        const $bg = document.getElementById(this._bgId);
        if ($bg && src.length) {
            $bg.style.backgroundImage = `url(${src})`;
        }
    }

    public updateBg(src: string): void {
        const $bg = document.getElementById(this._bgId);
        if ($bg && src.length) {
            $bg.style.backgroundImage = `url(${src})`;
        }
    }
}
