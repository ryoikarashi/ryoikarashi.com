import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGiphyRepository } from "./IGiphyRepository";
import { Giphy } from "@/packages/ryoikarashi/domain/models/Giphy/Giphy";
import { Src } from "@/packages/ryoikarashi/domain/models/Giphy/ValueObjects";

export class GiphyRepository implements IGiphyRepository {
  private readonly _fallbackSearchLimit = 20;
  private readonly _fallbackSearchTerm = "funny kids";
  private readonly _client: GiphyFetch;

  constructor(client: GiphyFetch) {
    this._client = client;
  }

  async getRandom(): Promise<Giphy> {
    const limit = Number(
      process.env.GIPHY_SEARCH_LIMIT ?? this._fallbackSearchLimit
    );
    const { data } = await this._client.search(
      process.env.GIPHY_SEARCH_TERM ?? this._fallbackSearchTerm,
      {
        limit,
      }
    );
    const randomIndex = Math.floor(Math.random() * limit);
    const gif = data[randomIndex];
    const src = gif?.images?.original?.url;

    if (!src) {
      return new Giphy(Src.of(null));
    }

    return new Giphy(Src.of(src));
  }
}
