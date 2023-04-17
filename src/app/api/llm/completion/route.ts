import { NextResponse } from 'next/server';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';
import { LLM, LLMConfig } from '@/packages/ryoikarashi/domain/models';
import { FirebaseService } from '@/packages/ryoikarashi/application/Firebase/FirebaseService';
import { SpotifyTrackRepository } from '@/packages/ryoikarashi/infrastructure/repositories/TrackRepository/SpotifyTrackRepository';
import { LLMRepository } from '@/packages/ryoikarashi/infrastructure/repositories/LLMRepository/LLMRepository';
import { LLMService } from '@/packages/ryoikarashi/application/LLM/LLMService';

const db = new FirebaseService({
  databaseURL: process.env.FIRESTORE_DB_URL || '',
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY || '',
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || '',
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || '',
}).init();

const llmClient = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY || '',
  })
);

const llmConfig: LLMConfig = {
  maxTokens: Number(process.env.LLM_MAX_TOKENS ?? LLM.DEFAULT_CONFIG.maxTokens),
  timeout: Number(process.env.LLM_TIMEOUT ?? LLM.DEFAULT_CONFIG.timeout),
  model: process.env.LLM_MAX_MODEL ?? LLM.DEFAULT_CONFIG.model,
};

export async function GET() {
  try {
    const llmService = new LLMService(
      new LLMRepository(llmClient, llmConfig),
      new SpotifyTrackRepository(
        db,
        axios,
        'spotify_last_listening_track',
        'ryoikarashi-com'
      )
    );
    const llm = await llmService.getTrackExplanation();
    return NextResponse.json(llm.toPlainObj());
  } catch (err) {
    return NextResponse.json(LLM.DEFAULT_PLAIN_OBJ);
  }
}

export const dynamic = 'force-dynamic';
