import {AppThunk} from "../../ui/app/store";
import {setSongFiles, setStatus, setVoice} from "../revoicer/revoicerSlice";
import {RevoicerService} from "../../services/RevoicerService";
import {updateFile} from "./updateFile";
import {RevoicerStatus} from "../revoicer/revoicerStatus";
import {setPlayingState} from "../player/setPlayingState";
import {PlayerState} from "../player/playerSlice";
import {PlayerService} from "../../services/PlayerService";

const playerService = PlayerService.instance();

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

      dispatch(setStatus(RevoicerStatus.Revoicing));
      await revoicerService.revoice(file, async (outputFile) => {
        let values = updateFile(files, outputFile);
        dispatch(setSongFiles(values));
        dispatch(setStatus(RevoicerStatus.Revoiced));
        dispatch(setVoice(undefined));
        let previousState = getState().player.state;
        await dispatch(setPlayingState(PlayerState.Paused));
        playerService.setTime(0);

        setTimeout(async () => {
          await dispatch(setPlayingState(previousState));
        }, 1000);
      });
    }
  };
}
