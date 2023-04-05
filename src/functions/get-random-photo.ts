import axios from 'axios';
import { APIGatewayProxyCallback, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { isProduction } from '../utils';
import { config } from 'dotenv';
import { IOAuthConfig } from '../functions-src/Repositories/TokenRepository/ITokenRepository';
import { GoogleTokenRepository } from '../functions-src/Repositories/TokenRepository/GoogleTokenRepository';
import { FirebaseService } from '../functions-src/Services/Firebase/FirebaseService';
import { GooglePhotosRepository } from '../functions-src/Repositories/PhotoRepository/GooglePhotosRepository';
import { AlbumId } from '../functions-src/Entities/Photo/ValueObjects';
import { GooglePhotoService } from '../functions-src/Services/Photo/GooglePhotoService';
import { TokenService } from '../functions-src/Services/Token/TokenService';

// load environment variables from .env
config();

// initialize firebase
const db = new FirebaseService({
    databaseURL: process.env.FIRESTORE_DB_URL || '',
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY || '',
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || '',
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || '',
}).init();

const googleOAuthConfig: IOAuthConfig = {
    clientId: process.env.GOOGLE_API_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_API_CLIENT_SECRET || '',
    authorizationCode: process.env.GOOGLE_API_AUTH_CODE || '',
    redirectUri: process.env.GOOGLE_API_REDIRECT_URI || '',
};

export const handler = async function (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: APIGatewayProxyEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: never,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    callback: APIGatewayProxyCallback,
): Promise<APIGatewayProxyResult> {
    // composition root with pure DI
    const googlePhotos = new GooglePhotoService(
        new GooglePhotosRepository(axios),
        new TokenService(axios, new GoogleTokenRepository(db, 'google_tokens', 'ryoikarashi-com'), googleOAuthConfig),
    );

    // get a random photo from a specified album
    const photo = await googlePhotos.getARandomPhotoFromAlbum(AlbumId.of(process.env.GOOGLE_PHOTOS_ALBUM_ID || ''));

    // return response
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': isProduction ? 'https://ryoikarashi.com' : 'http://localhost:8000',
        },
        body: photo.toJson(),
    };
};

process.on('uncaughtException', function (err) {
    console.error(err);
});
