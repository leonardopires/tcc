import axios from "axios"

export class LastFMService {
  private static _instance: LastFMService;
  private config: { api_key: string; secret: string };

  constructor() {
    this.config = {
      api_key: "71d68a2f1c117649057dc9fa938e176c",
      secret: "274b9ba6dab760166220707ecd341fe6",
    };


  }

  async getAlbumInfo({album, artist}: {album?: string, artist?: string}) {

    let method = "album.getInfo";
    let data = {
      ...(artist ? {artist} : {}),
      ...(album ? {album} : {}),
    }

    let params = {
      api_key: this.config.api_key,
      format: "json",
      method,
      ...data,
    };


    let paramsArray = Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)

    let result = await axios.get("https://ws.audioscrobbler.com/2.0/?" + paramsArray.join("&"))
    return result.data;
  }
  
  static instance() {
    if (!this._instance) {
      this._instance = new LastFMService();
    }
    return this._instance;
  }
}