import {setSongFiles, setStatus} from "../features/revoicer/revoicerSlice";
import {AppConfig} from "../AppConfig";
import * as signalR from "@microsoft/signalr";
import {HubConnection, HubConnectionState} from "@microsoft/signalr";
import {Func1} from "@reduxjs/toolkit";
import {IRevoiceJob} from "../features/revoicer/IRevoiceJob";
import {RevoicerStatus} from "../features/revoicer/revoicerStatus";

export class RevoicerService {
  private baseURL: string = AppConfig.api.baseURL;
  private connection: HubConnection;

  private static _instance: RevoicerService;

  private constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseURL + "revoicer")
      .build();
  }


  async split(job: IRevoiceJob, onSplitComplete: Func1<IRevoiceJob, void>) {
    await this.connect();
    this.connection.on("SplitComplete", (result: IRevoiceJob) => {
      console.log("Split Results received", result);
      onSplitComplete(result);
    });

    try {
      await this.connection.invoke("splitSong", job);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async connect() {

    if (this.connection.state === HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
      } catch (err) {
        console.error("Error connecting to websocket: ", err);
        throw err;
      }
    }
  }

  async revoice(job: IRevoiceJob, onRevoiceComplete: Func1<IRevoiceJob, void>) {
    await this.connect();
    this.connection.on("RevoiceComplete", (result: IRevoiceJob) => {
      console.log("Revoice Results received", result);
      onRevoiceComplete(result);
    });

    try {
      console.log("Calling websocket", this.connection.state)
      await this.connection.invoke("revoiceSong", job);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public static instance() {
    if (!this._instance) {
      this._instance = new RevoicerService();
    }
    return this._instance;
  }
}

RevoicerService.instance().connect();