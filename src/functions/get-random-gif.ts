import { APIGatewayProxyCallback, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GiphyFetch } from '@giphy/js-fetch-api';
import fetch from 'cross-fetch';
import { isProduction } from '../utils';
import { GiphyService } from '../functions-src/Services/Giphy/GiphyService';
import { GiphyRepository } from '../functions-src/Repositories/GiphyRepository/GiphyRepository';

// giphy SDK uses fetch API
global.fetch = fetch;

export const handler = async function (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: APIGatewayProxyEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: never,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    callback: APIGatewayProxyCallback,
): Promise<APIGatewayProxyResult> {
    // composition root with pure DI
    const giphyService = new GiphyService(new GiphyRepository(new GiphyFetch(process.env.GIPHY_API_KEY ?? '')));

    // get a random photo from a specified album
    const gif = await giphyService.getRandom();

    // return response
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': isProduction ? 'https://ryoikarashi.com' : 'http://localhost:8000',
        },
        body: gif.toJson(),
    };
};

process.on('uncaughtException', function (err) {
    console.error(err);
});
