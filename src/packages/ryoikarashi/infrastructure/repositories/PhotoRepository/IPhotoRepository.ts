import { Photo } from "@/packages/ryoikarashi/domain/models/Photo/Photo";
import { AlbumId } from "@/packages/ryoikarashi/domain/models/Photo/ValueObjects";
import { AccessToken } from "@/packages/ryoikarashi/domain/models/Token/ValueObjects";

export interface IPhotoRepository {
  // queries
  getPhotosFromAlbum(
    albumId: AlbumId,
    accessToken: AccessToken,
    callback: () => Promise<AccessToken>
  ): Promise<Array<Photo>>;
}
