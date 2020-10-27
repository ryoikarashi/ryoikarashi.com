import {IGooglePhotoService} from "./IGooglePhotoService";
import {AccessToken} from "../../Domains/Token/AccessToken";
import {Token} from "../../Domains/Token/Token";
import {AlbumId} from "../../Domains/Photo/AlbumId";
import {Photo} from "../../Domains/Photo/Photo";
import {IPhotoRepository} from "../../Repositories/PhotoRepository/IPhotoRepository";
import {IGoogleTokenRepository} from "../../Repositories/TokenRepository/IGoogleTokenRepository";
import axios from "axios";
import {RefreshToken} from "../../Domains/Token/RefreshToken";
import {Url} from "../../Domains/Photo/Url";

export interface GoogleApiConfig {
    clientId: string;
    clientSecret: string;
    authorizationCode: string;
    redirectUri: string;
}

export class GooglePhotoService implements IGooglePhotoService {
    private readonly _tokenRepo: IGoogleTokenRepository;
    private readonly _photoRepo: IPhotoRepository;
    private readonly _config: GoogleApiConfig;

    constructor(tokenRepo: IGoogleTokenRepository, photoRepo: IPhotoRepository, config: GoogleApiConfig) {
        this._tokenRepo = tokenRepo;
        this._photoRepo = photoRepo;
        this._config = config;
    }

    async getARandomPhotoFromAlbum(accessToken: AccessToken, albumId: AlbumId): Promise<Photo> {
        const photos = await this._photoRepo.getPhotosFromAlbum(albumId, accessToken, async () => {
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

    async getToken(): Promise<Token> {
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

    async refreshAccessToken(): Promise<AccessToken> {
        const token = await this._tokenRepo.getFirstToken();
        const refreshedToken = await this._tokenRepo.refreshToken(axios, token, this._config);
        await this._tokenRepo.storeAccessTokenAndMaybeRefreshToken(refreshedToken);
        return refreshedToken.accessToken;
    }
}
