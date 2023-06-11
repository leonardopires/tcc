import axios from "axios";

export enum LastFMImageSizes {
  Default = "",
  Small = "small",
  Medium = "medium",
  Large = "large",
  ExtraLarge = "extralarge",
  Mega = "mega",
}

export class LastFMService {
  private static _instance: LastFMService;
  private config: { api_key: string; secret: string };

  constructor() {
    this.config = {
      api_key: "71d68a2f1c117649057dc9fa938e176c",
      secret: "274b9ba6dab760166220707ecd341fe6",
    };


  }

  async getAlbumInfo({album, artist}: { album?: string, artist?: string }) {
    let data = {
      ...(artist ? {artist} : {}),
      ...(album ? {album} : {}),
    };
    return await this.invoke("album.getInfo", data);
  }

  async getArtistInfo(artist: string) {
    return await this.invoke("artist.getInfo", {artist});
  }

  findImage(results: any, size: LastFMImageSizes = LastFMImageSizes.Default) {
    let image: string | undefined;
    let imageEntry = (results?.album ?? results?.artist)?.image?.find((item: any) => item.size === size);

    if (imageEntry) {
      image = imageEntry["#text"] as string;
    }
    return image && image.trim().length > 0 ? image : undefined;
  }

  private async invoke(method: string, data: {}) {
    let params = {
      api_key: this.config.api_key,
      format: "json",
      method,
      ...data,
    };


    let paramsArray = Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);

    let result = await axios.get("https://ws.audioscrobbler.com/2.0/?" + paramsArray.join("&"));
    return result.data;
  }

  static instance() {
    if (!this._instance) {
      this._instance = new LastFMService();
    }
    return this._instance;
  }
}