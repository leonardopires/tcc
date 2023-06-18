import {Buffer} from "buffer/";

export class UrlService {
  private static _instance: UrlService;

  public getBase64URL(imageData: ArrayLike<number>, contentType: string) {
  let buffer = Buffer.from(imageData as []);
  let base64 = buffer.toString("base64");
  let base64Url = `data:${contentType};base64,${base64}`;
  return base64Url;
}


  public static instance() {
    if (!this._instance) {
      this._instance = new UrlService();
    }
    return this._instance;
  }
}