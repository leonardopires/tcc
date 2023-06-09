import SpotifyWebApi from "spotify-web-api-node";

export class SpotifyService {
  private api: SpotifyWebApi;
  private accessToken?: string;
  static _instance: SpotifyService;

  constructor() {
    this.api = new SpotifyWebApi({
      clientId: "2a368592571f435d8949d10bae3f1b04",
      clientSecret: "8b44950216cf413a967675dcf49cb84d",
      redirectUri: "http://localhost:3000/",
    });
  }

  async signIn() {
    let response = await this.api.authorizationCodeGrant("implicit");

    this.accessToken = response.body.access_token;
  }

  async searchTrack(query : {artist?: string, track?: string}): Promise<string> {
    let queryParts: string[] = [];
    let {artist, track} = query;

    if (artist) {
      queryParts.push(`artist: ${artist}`)
    }

    if (track) {
      queryParts.push(`track: ${track}`)
    }

    try {
      let result: any = await new Promise((resolve, reject) => {
        this.api.searchTracks(queryParts.join(" ")).then(resolve, reject);
      });

      return result.body as string;
    } catch(e: any) {
      throw new Error(e.message, {cause: e});
    }
  }

  static instance() {
    if (!this._instance) {
      this._instance = new SpotifyService();
      this._instance.signIn();
    }
    return this._instance;
  }
}
