import axios from 'axios';
import { APIGatewayProxyCallback, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { OpenAIApi, Configuration } from 'openai';
import { config } from 'dotenv';
import { isProduction } from '../utils';
import { FirebaseService } from '../functions-src/Services/Firebase/FirebaseService';
import { LLMRepository } from '../functions-src/Repositories/LLMRepository/LLMRepository';
import { SpotifyTrackRepository } from '../functions-src/Repositories/TrackRepository/SpotifyTrackRepository';
import { LLMService } from '../functions-src/Services/LLM/LLMService';
import { LLM, LLMConfig } from '../functions-src/Entities/LLM/LLM';

// load environment variables from .env
config();

// initialize firebase
const db = new FirebaseService({
    databaseURL: process.env.FIRESTORE_DB_URL || '',
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY || '',
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || '',
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || '',
}).init();

const llmClient = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_API_KEY || '',
    }),
);

const llmConfig: LLMConfig = {
    maxTokens: Number(process.env.LLM_MAX_TOKENS ?? LLM.DEFAULT_CONFIG.maxTokens),
    timeout: Number(process.env.LLM_TIMEOUT ?? LLM.DEFAULT_CONFIG.timeout),
    model: process.env.LLM_MAX_MODEL ?? LLM.DEFAULT_CONFIG.model,
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
    const llmService = new LLMService(
        new LLMRepository(llmClient, llmConfig),
        new SpotifyTrackRepository(db, axios, 'spotify_last_listening_track', 'ryoikarashi-com'),
    );

    const llm = await llmService.getTrackExplanation();

    // return response
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': isProduction ? 'https://ryoikarashi.com' : 'http://localhost:8000',
        },
        body: llm.toJson(),
    };
};

process.on('uncaughtException', function (err) {
    console.error(err);
});
