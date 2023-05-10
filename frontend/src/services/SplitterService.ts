import {IFileDescriptor} from "../features/uploadSong/uploadSongsSlice";
import axios from "axios";
import {AppConfig} from "../AppConfig";
import * as signalR from "@microsoft/signalr";

export class SplitterService {
  private baseURL: string = AppConfig.api.baseURL;

  async split(file: IFileDescriptor) {
    let result = await axios.post(
      "Splitter/split",
      file,
      {
        baseURL: this.baseURL,
      })
    return result.data as IFileDescriptor[];
  }

  async connect() {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseURL + "revoicer")
      .build();

    connection.on("messageReceived", (username: string, message: string) => {
      console.log(username, message);
    })

    try {
      await connection.start()
      connection.stream("Streaming").subscribe({
        error(err: any) {
          console.error("Stream error", err);
        },
        next(value: any) {
          console.log("Message", value);
        },
        complete() {
          console.log("Complete")
        }
      });
    } catch (err) {
      console.error("Error connecting to websocket: ", err)
    }
  }
}