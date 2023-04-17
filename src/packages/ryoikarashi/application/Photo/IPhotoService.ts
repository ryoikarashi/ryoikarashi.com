import { AlbumId } from "@/packages/ryoikarashi/domain/models/Photo/ValueObjects";
import { Photo } from "@/packages/ryoikarashi/domain/models/Photo/Photo";

export interface IPhotoService {
  getARandomPhotoFromAlbum(albumId: AlbumId): Promise<Photo>;
}
