import * as admin from "firebase-admin";
import axios from "axios";
import { stringify } from "query-string";
import { GoogleTokenRepository } from "./GoogleTokenRepository";
import { HTTPTokenResponse, IOAuthConfig } from "./ITokenRepository";
import { Token } from "@/packages/ryoikarashi/domain/models/Token/Token";
import {
  RefreshToken,
  AccessToken,
} from "@/packages/ryoikarashi/domain/models/Token/ValueObjects";

// create mocks
jest.mock("axios");
jest.mock("firebase-admin", () => ({
  initializeApp: jest.fn().mockReturnThis(),
  firestore: jest.fn(() => ({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn(() => ({
      data: jest.fn(() => ({})),
      exists: true,
    })),
    update: jest.fn(),
    create: jest.fn(),
  })),
}));

// clear all mocks before each test
afterEach(() => {
  jest.clearAllMocks();
});

describe("Test GoogleTokenRepository", () => {
  const oauthConfig: IOAuthConfig = {
    authorizationCode: "authorization_code",
    clientId: "client_id",
    clientSecret: "client_secret",
    redirectUri: "https://example.com/callback",
  };

  const httpTokenResponse: HTTPTokenResponse = {
    access_token: "access_token_1",
    refresh_token: "refresh_token_1",
  };

  const token = new Token(
    AccessToken.of(httpTokenResponse.access_token),
    RefreshToken.of(httpTokenResponse.refresh_token)
  );

  const collectionName = "google_tokens";
  const docPath = "ryoikarashi-com";

  describe("getTokenByAuthorizationCode", () => {
    it("it has been called with appropriate params", async () => {
      const repository = new GoogleTokenRepository(
        admin.initializeApp().firestore(),
        collectionName,
        docPath
      );
      jest
        .spyOn(axios, "post")
        .mockResolvedValueOnce({ data: httpTokenResponse });
      await repository.getTokenByAuthorizationCode(axios, oauthConfig);
      const tokenEndpoint = "https://www.googleapis.com/oauth2/v4/token";
      const params = {
        code: oauthConfig.authorizationCode,
        client_id: oauthConfig.clientId,
        client_secret: oauthConfig.clientSecret,
        redirect_uri: oauthConfig.redirectUri,
        grant_type: "authorization_code",
      };
      const requestConfig = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };

      expect(admin.initializeApp).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        tokenEndpoint,
        stringify(params),
        requestConfig
      );
    });

    it("returns a valid token", async () => {
      const repository = new GoogleTokenRepository(
        admin.initializeApp().firestore(),
        collectionName,
        docPath
      );
      jest
        .spyOn(axios, "post")
        .mockResolvedValueOnce({ data: httpTokenResponse });

      expect(admin.initializeApp).toHaveBeenCalledTimes(1);
      await expect(
        repository.getTokenByAuthorizationCode(axios, oauthConfig)
      ).resolves.toEqual(token);
    });

    it("throws an exception", async () => {
      const db = admin.initializeApp().firestore();
      const repository = new GoogleTokenRepository(db, collectionName, docPath);
      jest.spyOn(axios, "post").mockRejectedValueOnce(new Error());

      expect(admin.initializeApp).toHaveBeenCalledTimes(1);
      await expect(
        repository.getTokenByAuthorizationCode(axios, oauthConfig)
      ).rejects.toEqual(new Error());
    });
  });

  describe("refreshToken", () => {
    const newHttpTokenResponse = {
      access_token: "new_access_token",
      refresh_token: "new_refresh_token",
    };
    const newToken = new Token(
      AccessToken.of(newHttpTokenResponse.access_token),
      RefreshToken.of(newHttpTokenResponse.refresh_token)
    );

    it("it has been called with appropriate params", async () => {
      const params = {
        client_id: oauthConfig.clientId,
        client_secret: oauthConfig.clientSecret,
        grant_type: "refresh_token",
        refresh_token: httpTokenResponse.refresh_token,
      };
      const requestConfig = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };

      const repository = new GoogleTokenRepository(
        admin.initializeApp().firestore(),
        collectionName,
        docPath
      );
      jest
        .spyOn(axios, "post")
        .mockResolvedValueOnce({ data: newHttpTokenResponse });
      await repository.refreshToken(axios, token, oauthConfig);
      const tokenEndpoint = "https://www.googleapis.com/oauth2/v4/token";

      expect(admin.initializeApp).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        tokenEndpoint,
        stringify(params),
        requestConfig
      );
    });

    it("returns a new token", async () => {
      const repository = new GoogleTokenRepository(
        admin.initializeApp().firestore(),
        collectionName,
        docPath
      );
      jest
        .spyOn(axios, "post")
        .mockResolvedValueOnce({ data: newHttpTokenResponse });
      expect(admin.initializeApp).toHaveBeenCalledTimes(1);
      await expect(
        repository.refreshToken(axios, token, oauthConfig)
      ).resolves.toEqual(newToken);
    });

    it("throws an exception", async () => {
      const repository = new GoogleTokenRepository(
        admin.initializeApp().firestore(),
        collectionName,
        docPath
      );
      jest.spyOn(axios, "post").mockRejectedValueOnce(new Error());

      expect(admin.initializeApp).toHaveBeenCalledTimes(1);
      await expect(
        repository.refreshToken(axios, token, oauthConfig)
      ).rejects.toEqual(new Error());
    });
  });
});
