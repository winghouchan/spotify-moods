// @ts-ignore
const SpotifyApi = jest.requireActual("spotify-web-api-node");

module.exports = jest.fn().mockImplementation(
  function (credentials: any) {
    // @ts-ignore
    this._credentials = credentials || {};

    return {
      ...SpotifyApi.prototype,

      authorizationCodeGrant: jest.fn().mockReturnValue({ body: {} }),
      getMe: jest.fn().mockReturnValue({ body: {} }),
    };
  }.bind(SpotifyApi.prototype)
);
