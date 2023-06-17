import {IVoice} from "./IVoice";
import {TrackType} from "./TrackType";

export interface ITrack extends IVoice {
  volume: number;
  filePath: string;
  fileName: string;
  type: TrackType;
}