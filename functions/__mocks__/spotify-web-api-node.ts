// @ts-ignore
const SpotifyApi = jest.requireActual("spotify-web-api-node");

module.exports = jest.fn().mockImplementation(
  function (credentials: any) {
    // @ts-ignore
    this._credentials = credentials || {};

    return {
      ...SpotifyApi.prototype,
    };
  }.bind(SpotifyApi.prototype)
);
