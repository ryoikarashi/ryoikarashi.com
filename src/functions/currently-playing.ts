import { APIGatewayProxyEvent, APIGatewayProxyCallback } from "aws-lambda";
import axios, { AxiosResponse } from 'axios';
import { config } from 'dotenv';

// load environment variables from .env
config();

const getCurrentlyPlaying = async (): Promise<AxiosResponse> => {
  const URL = 'https://api.spotify.com/v1/me/player/currently-playing?market=JP';
  return await axios.get(URL, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SPOTIFY_TOKEN}`,
    },
  });
};


export const handler = async function (
    event: APIGatewayProxyEvent,
    context: any,
    callback: APIGatewayProxyCallback
) {
  const { data } = await getCurrentlyPlaying();
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(data),
  })
};
