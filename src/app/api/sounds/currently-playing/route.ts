import { NextResponse } from 'next/server';
import axios from 'axios';
import { SpotifyService } from '@/packages/ryoikarashi/application/Track/SpotifyService';
import { SpotifyTrackRepository } from '@/packages/ryoikarashi/infrastructure/repositories/TrackRepository/SpotifyTrackRepository';
import { SpotifyTokenRepository } from '@/packages/ryoikarashi/infrastructure/repositories/TokenRepository/SpotifyTokenRepository';
import { TokenService } from '@/packages/ryoikarashi/application/Token/TokenService';
import { FirebaseService } from '@/packages/ryoikarashi/application/Firebase/FirebaseService';
import { PusherService } from '@/packages/ryoikarashi/application/Pusher/PusherService';
import { type IOAuthConfig } from '@/packages/ryoikarashi/infrastructure/repositories/TokenRepository/ITokenRepository';
import { Track } from '@/packages/ryoikarashi/domain/models';

const db = new FirebaseService({
  databaseURL: process.env.FIRESTORE_DB_URL ?? '',
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? '',
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? '',
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID ?? '',
}).init();

const pusher = new PusherService({
  appId: process.env.PUSHER_APP_ID ?? '',
  key: process.env.PUSHER_KEY ?? '',
  secret: process.env.PUSHER_SECRET ?? '',
  cluster: process.env.PUSHER_CLUSTER ?? '',
  useTLS: process.env.PUSHER_USE_TLS === 'true',
}).init();

const spotifyOAuthConfig: IOAuthConfig = {
  clientId: process.env.SPOTIFY_CLIENT_ID ?? '',
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? '',
  authorizationCode: process.env.SPOTIFY_AUTHORIZATION_CODE ?? '',
  basicAuthorizationCode: Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID ?? ''}:${
      process.env.SPOTIFY_CLIENT_SECRET ?? ''
    }`,
    'utf-8'
  ).toString('base64'),
  redirectUri: process.env.GOOGLE_API_REDIRECT_URI ?? '',
};

export async function GET(): Promise<NextResponse> {
  try {
    const spotify = new SpotifyService(
      new SpotifyTrackRepository(
        db,
        axios,
        'spotify_last_listening_track',
        'ryoikarashi-com'
      ),
      new TokenService(
        axios,
        new SpotifyTokenRepository(db, 'spotify_tokens', 'ryoikarashi-com'),
        spotifyOAuthConfig
      )
    );

    const track = await spotify.getCurrentlyListeningTrack();

    await pusher.trigger(
      'spotify',
      'fetch-currently-listening-track',
      track.toPlainObj()
    );

    return NextResponse.json(track.toPlainObj());
  } catch (err) {
    return NextResponse.json(Track.DEFAULT_PLAIN_OBJ);
  }
}

export const dynamic = 'force-dynamic';
