import { NextResponse } from 'next/server';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { GiphyService } from '@/packages/ryoikarashi/application/Giphy/GiphyService';
import { GiphyRepository } from '@/packages/ryoikarashi/infrastructure/repositories/GiphyRepository/GiphyRepository';
import { Giphy } from '@/packages/ryoikarashi/domain/models';

// giphy SDK uses fetch API
global.fetch = fetch;

export async function GET(): Promise<NextResponse> {
  try {
    const giphyService = new GiphyService(
      new GiphyRepository(new GiphyFetch(process.env.GIPHY_API_KEY ?? ''))
    );
    const gif = await giphyService.getRandom();
    return NextResponse.json(gif.toPlainObj());
  } catch (err) {
    return NextResponse.json(Giphy.DEFAULT_PLAIN_OBJ);
  }
}

export const dynamic = 'force-dynamic';
