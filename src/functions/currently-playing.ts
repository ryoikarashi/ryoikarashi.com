import { APIGatewayProxyEvent, APIGatewayProxyCallback } from "aws-lambda";
import { config } from 'dotenv';
import axios from "axios";
import { stringify as QsStringify } from "query-string";
import { writeFileSync, readFileSync } from "fs";

const CREDENTIAL_FILE = `${process.env.NODE_ENV === 'production' ? '/tmp' : '.'}/credentials1.json`;

// load environment variables from .env
config();

interface ISpotify {
  refreshAccessToken(): Promise<string>;
  getCurrentlyListeningTrack(accessToken: string|null): Promise<any>;
  getAccessTokenAndRefreshToken(): Promise<string>;
}

class Spotify implements ISpotify {
  private static encodeAuthorizationCode(): string {
    return new Buffer(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
  }

  async getAccessTokenAndRefreshToken(): Promise<string> {
    try {
      const { access_token } = JSON.parse(await readFileSync(CREDENTIAL_FILE, 'utf-8'));
      return access_token;
    } catch {
      const headers = {
        "Authorization": `Basic ${Spotify.encodeAuthorizationCode()}`,
        "Content-Type": 'application/x-www-form-urlencoded',
      };
      const params = {
        "grant_type": "authorization_code",
        "code": process.env.SPOTIFY_AUTHORIZATION_CODE,
        "redirect_uri": "https://example.com/callback"
      };

      const { data: { access_token, refresh_token } } =
          await axios.post("https://accounts.spotify.com/api/token", QsStringify(params), { headers });

      await writeFileSync(CREDENTIAL_FILE, JSON.stringify({ access_token, refresh_token }));
      return access_token;
    }
  }

  async getCurrentlyListeningTrack(accessToken: string|null): Promise<any> {
    const options = {
      "headers": { "Authorization": `Bearer  ${accessToken}` },
      "muteHttpExceptions": true,
    };
    const { status, data } = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", options);

    switch (status) {
      case 200: // when listening to a track on spotify
        return data;
      case 401: // when having an expired access token (unauthorized request)
        return await this.getCurrentlyListeningTrack(await this.refreshAccessToken());
      case 204: // when nothing's playing
      default:
        return null;
    }
  }

  async refreshAccessToken(): Promise<string> {
    const { refreshToken } = JSON.parse(await readFileSync(CREDENTIAL_FILE, 'utf-8'));

    const headers = {
      "Authorization": `Basic ${Spotify.encodeAuthorizationCode()}`,
      "Content-Type": "application/x-www-form-urlencoded"
    };

    const payload = {
      "grant_type": "refresh_token",
      "refresh_token": refreshToken
    };

    const options = {
      "payload": payload,
      "headers": headers,
    };

    const { data: { access_token, refresh_token } } = await axios.get("https://accounts.spotify.com/api/token", options);

    const data = refresh_token
      ? { access_token, refresh_token }
      : { access_token };
    await writeFileSync(CREDENTIAL_FILE, JSON.stringify(data));

    return access_token;
  }
}

export const handler = async function (
    event: APIGatewayProxyEvent,
    context: any,
    callback: APIGatewayProxyCallback
): Promise<void> {
  const Client = new Spotify();
  const accessToken = await Client.getAccessTokenAndRefreshToken();
  const data = await Client.getCurrentlyListeningTrack(accessToken);

  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(data),
  });
};

process.on('uncaughtException', function (err) {
  console.error(err);
});

// https://accounts.spotify.com/authorize?response_type=code&scope=user-read-currently-playing&redirect_uri=https://example.com/callback&client_id=6d7477c13aae4568a54db0332dd1ec48
