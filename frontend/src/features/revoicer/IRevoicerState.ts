import {RevoicerStatus} from "./revoicerStatus";
import {IRevoiceJob} from "./IRevoiceJob";
import {IID3Tag} from "id3-parser/lib/interface";
import {IVoice} from "./IVoice";

export interface IRevoicerState {
  voice?: string,
  status: RevoicerStatus,
  uploadedFiles: IRevoiceJob[];
  songInfo?: IID3Tag,
  artwork?: string,
  voices: IVoice[];
}