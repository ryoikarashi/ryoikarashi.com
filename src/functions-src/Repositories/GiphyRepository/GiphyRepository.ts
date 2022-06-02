import { IGiphyRepository } from './IGiphyRepository';
import { Giphy } from '../../Entities/Giphy/Giphy';
import { Src } from '../../Entities/Giphy/Src';
import { GiphyFetch } from '@giphy/js-fetch-api';

export class GiphyRepository implements IGiphyRepository {
    private readonly _limit = 20;
    private readonly _client: GiphyFetch;

    constructor(client: GiphyFetch) {
        this._client = client;
    }

    async getRandom(): Promise<Giphy> {
        const { data } = await this._client.search(process.env.GIPHY_SEARCH_TERM ?? '', { limit: this._limit });
        const randomIndex = Math.floor(Math.random() * this._limit);
        const gif = data[randomIndex];
        const src = gif?.images?.original?.url;

        if (!src) {
            return new Giphy(Src.of(null));
        }

        return new Giphy(Src.of(src));
    }
}
