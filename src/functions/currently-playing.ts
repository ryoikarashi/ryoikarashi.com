import { APIGatewayProxyEvent, APIGatewayProxyCallback } from "aws-lambda";
import { config } from 'dotenv';
import axios from "axios";
import { stringify as QsStringify } from "query-string";
import * as admin from 'firebase-admin';
import { isProduction } from "../utils";

// load environment variables from .env
config();

// Initialise the admin with the credentials when no firebase app
if (!admin.apps.length) {
  const adminAppConfig = {
    databaseURL: process.env.FIRESTORE_DB_URL,
    credential: admin.credential.cert({
      privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    }),
  };
  admin.initializeApp(adminAppConfig);
}

// create a firestore db instance
const db = admin.firestore();

if (!isProduction && !admin.apps.length) {
  db.settings({
    host: process.env.FIRESTORE_DB_URL,
    ssl: false
  });
}

const tokenRef = db.collection('spotify_tokens').doc('ryoikarashi-com');
const lastTrackRef = db.collection('spotify_last_listening_track').doc('ryoikarashi-com');

interface ISpotify {
  refreshAccessToken(): Promise<string>;
  getCurrentlyListeningTrack(accessToken: string|null): Promise<any>;
  getAccessTokenAndRefreshToken(): Promise<string>;
}

class Spotify implements ISpotify {
  private static encodeAuthorizationCode(): string {
    return Buffer
        .from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`, 'utf-8')
        .toString('base64');
  }

  async getAccessTokenAndRefreshToken(): Promise<string> {
    const doc = await tokenRef.get();
    if (doc.exists && doc.data()?.access_token) {
      return doc.data()?.access_token;
    }

    const headers = {
      "Authorization": `Basic ${Spotify.encodeAuthorizationCode()}`,
      "Content-Type": 'application/x-www-form-urlencoded',
    };
    const params = {
      "grant_type": "authorization_code",
      "code": process.env.SPOTIFY_AUTHORIZATION_CODE,
      "redirect_uri": "https://example.com/callback"
    };

    try {
      const { data: { access_token, refresh_token } } =
          await axios.post("https://accounts.spotify.com/api/token", QsStringify(params), { headers });

      if (doc.exists) {
        await tokenRef.update({ access_token, refresh_token });
      } else {
        await tokenRef.create({ access_token, refresh_token })
      }

      return access_token;
    } catch(e) {
      return '';
    }
  }

  async getCurrentlyListeningTrack(accessToken: string|null): Promise<any> {
    const options = {
      "headers": { "Authorization": `Bearer  ${accessToken}` },
      "muteHttpExceptions": true,
    };

    try {
      const { status, data } = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", options);

      switch (status) {
        case 200: // when listening to a track on spotify
          if ((await lastTrackRef.get()).exists) {
            await lastTrackRef.update(data);
          } else {
            await lastTrackRef.create(data);
          }
          return data;
        case 401: { // when having an expired access token (unauthorized request)
          const refreshToken = await this.refreshAccessToken();
          return await this.getCurrentlyListeningTrack(refreshToken);
        }
        case 204: // when nothing's playing
        default:
          if (!(await lastTrackRef.get()).exists) {
            return null;
          }

          return (await lastTrackRef.get()).data();
      }
    } catch(e) {
      const refreshToken = await this.refreshAccessToken();
      return await this.getCurrentlyListeningTrack(refreshToken);
    }
  }

  async refreshAccessToken(): Promise<string> {
    const doc = await tokenRef.get();
    const refreshToken = doc.data()?.refresh_token;

    const headers = {
      "Authorization": `Basic ${Spotify.encodeAuthorizationCode()}`,
      "Content-Type": "application/x-www-form-urlencoded"
    };

    const payload = {
      "grant_type": "refresh_token",
      "refresh_token": refreshToken
    };

    const { data: { access_token, refresh_token } } =
        await axios.post("https://accounts.spotify.com/api/token", QsStringify(payload), { headers });

    const data = refresh_token ? { access_token, refresh_token } : { access_token };

    await tokenRef.update(data);

    return access_token;
  }
}

export const handler = async function (
    event: APIGatewayProxyEvent,
    context: any,
    callback: APIGatewayProxyCallback
): Promise<any> {
  const Client = new Spotify();
  const accessToken = await Client.getAccessTokenAndRefreshToken();
  const data = await Client.getCurrentlyListeningTrack(accessToken);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': isProduction ? 'https://ryoikarashi.com' : 'http://localhost:8000',
    },
    body: JSON.stringify(data),
  };
};

process.on('uncaughtException', function (err) {
  // console.error(err);
});
