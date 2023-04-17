import axios from "axios";
import { NextResponse } from "next/server";
import { GooglePhotoService } from "@/packages/ryoikarashi/application/Photo/GooglePhotoService";
import { GooglePhotosRepository } from "@/packages/ryoikarashi/infrastructure/repositories/PhotoRepository/GooglePhotosRepository";
import { TokenService } from "@/packages/ryoikarashi/application/Token/TokenService";
import { GoogleTokenRepository } from "@/packages/ryoikarashi/infrastructure/repositories/TokenRepository/GoogleTokenRepository";
import { FirebaseService } from "@/packages/ryoikarashi/application/Firebase/FirebaseService";
import { IOAuthConfig } from "@/packages/ryoikarashi/infrastructure/repositories/TokenRepository/ITokenRepository";
import { AlbumId } from "@/packages/ryoikarashi/domain/models/Photo/ValueObjects";
import { Photo } from "@/packages/ryoikarashi/domain/models";

const db = new FirebaseService({
  databaseURL: process.env.FIRESTORE_DB_URL || "",
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY || "",
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || "",
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "",
}).init();

const googleOAuthConfig: IOAuthConfig = {
  clientId: process.env.GOOGLE_API_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_API_CLIENT_SECRET || "",
  authorizationCode: process.env.GOOGLE_API_AUTH_CODE || "",
  redirectUri: process.env.GOOGLE_API_REDIRECT_URI || "",
};

export async function GET() {
  try {
    const googlePhotos = new GooglePhotoService(
      new GooglePhotosRepository(axios),
      new TokenService(
        axios,
        new GoogleTokenRepository(db, "google_tokens", "ryoikarashi-com"),
        googleOAuthConfig
      )
    );
    const photo = await googlePhotos.getARandomPhotoFromAlbum(
      AlbumId.of(process.env.GOOGLE_PHOTOS_ALBUM_ID || "")
    );
    return NextResponse.json(photo.toPlainObj());
  } catch (err) {
    return NextResponse.json(Photo.DEFAULT_PLAIN_OBJ);
  }
}

export const dynamic = "force-dynamic";
