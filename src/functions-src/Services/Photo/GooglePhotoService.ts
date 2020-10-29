import axios from "axios";
import {IPhotoService} from "./IPhotoService";
import {IOAuthConfig, ITokenRepository} from "../../Repositories/TokenRepository/ITokenRepository";
import {IPhotoRepository} from "../../Repositories/PhotoRepository/IPhotoRepository";import {AccessToken} from "../../Domains/Token/AccessToken";
import {Token} from "../../Domains/Token/Token";
import {AlbumId} from "../../Domains/Photo/AlbumId";
import {Photo} from "../../Domains/Photo/Photo";
import {RefreshToken} from "../../Domains/Token/RefreshToken";
import {Url} from "../../Domains/Photo/Url";

export class GooglePhotoService implements IPhotoService {
    private readonly _tokenRepo: ITokenRepository;
    private readonly _photoRepo: IPhotoRepository;
    private readonly _config: IOAuthConfig;

    constructor(tokenRepo: ITokenRepository, photoRepo: IPhotoRepository, config: IOAuthConfig) {
        this._tokenRepo = tokenRepo;
        this._photoRepo = photoRepo;
        this._config = config;
    }

    async getARandomPhotoFromAlbum(albumId: AlbumId): Promise<Photo> {
        const token = await this.getToken();

        const photos = await this._photoRepo.getPhotosFromAlbum(albumId, token.accessToken, async () => {
            return await this.refreshAccessToken();
        });
        const randomIndex = Math.floor(Math.random() * photos.length);
        const randomPhoto = photos?.[randomIndex];

        if (!randomPhoto) {
            return new Photo(
                Url.of(null),
            );
        }

        return randomPhoto;
    }

    private async getToken(): Promise<Token> {
        try {
            const currentToken = await this._tokenRepo.getFirstToken();

            if (currentToken.accessToken.isValid() && currentToken.refreshToken.isValid()) {
                return currentToken;
            }

            const tokenIssuedByAuthorizationCode =
                await this._tokenRepo.getTokenByAuthorizationCode(
                    axios,
                    this._config
                );

            await this._tokenRepo.storeAccessTokenAndMaybeRefreshToken(tokenIssuedByAuthorizationCode);
            return Promise.resolve(tokenIssuedByAuthorizationCode);
        } catch(e) {
            return Promise.resolve(
                new Token(
                    AccessToken.of(null),
                    RefreshToken.of(null),
                )
            );
        }
    }

    private async refreshAccessToken(): Promise<AccessToken> {
        const token = await this._tokenRepo.getFirstToken();
        const refreshedToken = await this._tokenRepo.refreshToken(axios, token, this._config);
        await this._tokenRepo.storeAccessTokenAndMaybeRefreshToken(refreshedToken);
        return refreshedToken.accessToken;
    }
}
