import {AppThunk} from "../../app/store";
import {setSongFiles, setStatus} from "../revoicer/revoicerSlice";
import {RevoicerService} from "../../services/RevoicerService";
import {updateFile} from "./updateFile";
import {IRevoiceJob} from "../revoicer/IRevoiceJob";
import {RevoicerStatus} from "../revoicer/revoicerStatus";

export function splitSongs(): AppThunk<Promise<void>> {

  return async (dispatch, getState) => {
    let state = getState();
    let files = state.revoicer.uploadedFiles;
    if (files.length > 0) {
      let revoicerService = RevoicerService.instance();
      let file = {
        ...files[0],
        voice: state.revoicer.voice,
      };
      dispatch(setStatus(RevoicerStatus.Splitting))
      await revoicerService.split(file, (outputFile) => {
        console.log("Split Response received: ", outputFile);
        let values = updateFile(files, outputFile);
        dispatch(setSongFiles(values));
        dispatch(setStatus(RevoicerStatus.Split))
      });
    }
  }
}
