import { Request, Response } from "express";
import * as functions from "firebase-functions";
import { URL } from "url";
import authorize from "./index";

jest.mock("crypto");

describe("authorize()", () => {
  let output: URL;

  beforeAll(() => {
    const request = {
      cookies: {
        state: "MOCKED_STATE_COOKIE",
      },
    } as Request;
    const response = {
      redirect(url: string) {
        output = new URL(url);
      },
    } as Response;

    authorize(request, response);
  });

  test("should redirect to the Spotify account service authorization endpoint", () => {
    expect(`${output.protocol}//${output.host}${output.pathname}`).toEqual(
      "https://accounts.spotify.com/authorize"
    );
  });

  test("the redirect URL should have the correct client ID query parameter value", () => {
    expect(output.searchParams.get("client_id")).toEqual(
      functions.config().spotify.client_id
    );
  });

  test("the redirect URL should have the correct response type query parameter value", () => {
    expect(output.searchParams.get("response_type")).toEqual("code");
  });

  test("the redirect URL should have the correct scopes in the scope query parameter", () => {
    expect(output.searchParams.get("scope")).toEqual(
      "user-read-recently-played"
    );
  });

  test("the redirect URL should have the correct state query parameter value", () => {
    expect(output.searchParams.get("state")).toEqual("MOCKED_STATE_COOKIE");
  });
});
