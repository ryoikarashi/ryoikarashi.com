import { APIGatewayProxyEvent, APIGatewayProxyCallback, APIGatewayProxyResult } from 'aws-lambda';
import { config } from 'dotenv';
import { isProduction } from '../utils';
import { FirebaseService } from '../functions-src/Services/Firebase/FirebaseService';
import { WordService } from '../functions-src/Services/Word/WordService';
import { WordRepository } from '../functions-src/Repositories/WordRepository/WordRepository';

// load environment variables from .env
config();

// initialize firebase
const db = new FirebaseService({
    databaseURL: process.env.FIRESTORE_DB_URL || '',
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY || '',
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || '',
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || '',
}).init();

export const handler = async function (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: APIGatewayProxyEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: never,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    callback: APIGatewayProxyCallback,
): Promise<APIGatewayProxyResult> {
    // composition root with pure DI
    const wordService = new WordService(new WordRepository(db, 'pali_word_list_by_initial_letter'));

    // get a random word
    const randomWord = await wordService.getARandomWord();

    // return response
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': isProduction ? 'https://ryoikarashi.com' : 'http://localhost:8000',
        },
        body: randomWord.toJson(),
    };
};

process.on('uncaughtException', function (err) {
    console.error(err);
});
