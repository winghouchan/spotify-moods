import { Request, Response } from "express";
import token from "./index";

const tokenMock = "TOKEN_MOCK";

jest.mock("firebase-admin", () => ({
  __esModule: true,
  default: {
    auth() {
      return {
        createCustomToken: jest.fn().mockReturnValue(tokenMock),
        createUser: jest.fn(),
        updateUser: jest.fn().mockImplementation(() => {
          throw { code: "auth/user-not-found" };
        }),
      };
    },
    credential: {
      cert: jest.fn(),
    },
    database: jest.fn().mockReturnValue({
      ref: jest.fn().mockReturnValue({
        set: jest.fn(),
        update: jest.fn(),
      }),
    }),
    initializeApp: jest.fn(),
  },
}));

describe("token()", () => {
  describe("when state cookie does not exist", () => {
    test("should return an unprocessable entity error", () => {
      const responseJsonMock = jest.fn();
      const responseStatusMock = jest
        .fn()
        .mockReturnValue({ json: responseJsonMock });

      const request = {} as Request;
      const response = {
        set: jest.fn(),
        status: responseStatusMock,
      } as unknown as Response;

      token(request, response);

      expect(responseStatusMock).toHaveBeenCalledWith(422);
    });
  });

  describe("when state cookie and state query parameter values do not match", () => {
    test("should return an unprocessable entity error", () => {
      const responseJsonMock = jest.fn();
      const responseStatusMock = jest
        .fn()
        .mockReturnValue({ json: responseJsonMock });

      const request = {
        cookies: {
          state: "STATE_VALUE_MOCK",
        },
        query: {
          state: "INCORRECT_STATE_VALUE_MOCK",
        },
      } as unknown as Request;
      const response = {
        set: jest.fn(),
        status: responseStatusMock,
      } as unknown as Response;

      token(request, response);

      expect(responseStatusMock).toHaveBeenCalledWith(422);
    });
  });

  describe("when state cookie and state from request body values do not match", () => {
    test("should return an unprocessable entity error", () => {
      const responseJsonMock = jest.fn();
      const responseStatusMock = jest
        .fn()
        .mockReturnValue({ json: responseJsonMock });

      const request = {
        cookies: {
          state: "STATE_VALUE_MOCK",
        },
        body: {
          data: {
            state: "INCORRECT_STATE_VALUE_MOCK",
          },
        },
      } as unknown as Request;
      const response = {
        set: jest.fn(),
        status: responseStatusMock,
      } as unknown as Response;

      token(request, response);

      expect(responseStatusMock).toHaveBeenCalledWith(422);
    });
  });

  describe("when code data does not exist in query parameter or request body", () => {
    test("should return an unprocessable entity error", () => {
      const stateValueMock = "STATE_VALUE_MOCK";
      const responseJsonMock = jest.fn();
      const responseStatusMock = jest
        .fn()
        .mockReturnValue({ json: responseJsonMock });

      const request = {
        cookies: {
          state: stateValueMock,
        },
        query: {
          state: stateValueMock,
        },
      } as unknown as Request;
      const response = {
        set: jest.fn(),
        status: responseStatusMock,
      } as unknown as Response;

      token(request, response);

      expect(responseStatusMock).toHaveBeenCalledWith(422);
    });
  });

  describe("when getting tokens from Spotify succeeds", () => {
    const responseJsonMock = jest.fn();

    beforeAll(() => {
      const stateValueMock = "STATE_VALUE_MOCK";
      const request = {
        cookies: {
          state: stateValueMock,
        },
        query: {
          code: "MOCKED_SPOTIFY_AUTHORIZATION_CODE",
          state: stateValueMock,
        },
      } as unknown as Request;
      const response = {
        set: jest.fn(),
        json: responseJsonMock,
      } as unknown as Response;

      token(request, response);
    });

    test("should return token", () => {
      expect(responseJsonMock).toHaveBeenCalledWith({
        data: { token: tokenMock },
      });
    });
  });
});
