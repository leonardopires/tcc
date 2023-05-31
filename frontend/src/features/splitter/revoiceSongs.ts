import {AppThunk} from "../../app/store";
import {RevoicerStatus, setSongFiles, setStatus} from "../revoicer/revoicerSlice";
import {RevoicerService} from "../../services/RevoicerService";
import {updateFile} from "./updateFile";

export function revoiceSongs(): AppThunk<Promise<void>> {

  return async (dispatch, getState) => {
    let state = getState();
    let files = state.revoicer.uploadedFiles;
    if (files.length > 0) {
      let revoicerService = RevoicerService.instance();
      let file = {
        ...files[0],
        voice: state.revoicer.voice,
      };
    console.log("Revoice Songs called", file);

      dispatch(setStatus(RevoicerStatus.Revoicing))
      await revoicerService.revoice(file, (outputFile) => {
        let values = updateFile(files, outputFile);
        dispatch(setSongFiles(values));
        dispatch(setStatus(RevoicerStatus.Revoiced))
      });
    }
  }
}
