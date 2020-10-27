// initialize pusher
import {APIGatewayProxyCallback, APIGatewayProxyEvent} from "aws-lambda";
import {config} from 'dotenv';
import {isProduction} from "../utils";
import {GoogleTokenRepository} from "../functions-src/Repositories/TokenRepository/GoogleTokenRepository";
import axios from "axios";
import {GoogleApiConfig, GooglePhotoService} from "../functions-src/Services/GooglePhoto/GooglePhotoService";
import {FirebaseService} from "../functions-src/Services/Firebase/FirebaseService";
import {PhotoRepository} from "../functions-src/Repositories/PhotoRepository/PhotoRepository";
import {AlbumId} from "../functions-src/Domains/Photo/AlbumId";

// load environment variables from .env
config();

// initialize firebase
const db = new FirebaseService({
    databaseURL: process.env.FIRESTORE_DB_URL || '',
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY || '',
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || '',
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || '',
}).init();

const googleApiConfig: GoogleApiConfig = {
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
    callback: APIGatewayProxyCallback
): Promise<any> {
    // composition root with pure DI
    const googlePhotos = new GooglePhotoService(
        new GoogleTokenRepository(db),
        new PhotoRepository(axios),
        googleApiConfig
    );

    // get tokens
    const token = await googlePhotos.getToken();

    // get a random photo from a specified album
    const photo = await googlePhotos.getARandomPhotoFromAlbum(token.accessToken, AlbumId.of(process.env.GOOGLE_PHOTOS_ALBUM_ID || ''));

    // return response
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':
                isProduction ? 'https://ryoikarashi.com' : 'http://localhost:8000',
        },
        body: photo.toJson(),
    };
};

process.on('uncaughtException', function (err) {
    console.error(err);
});
