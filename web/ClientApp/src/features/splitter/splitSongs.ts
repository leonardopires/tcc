import {AppThunk} from "../../app/store";
import {setSongFiles, setStatus} from "../revoicer/revoicerSlice";
import {RevoicerService} from "../../services/RevoicerService";
import {updateFile} from "./updateFile";
import {RevoicerStatus} from "../revoicer/revoicerStatus";
import {setPlayingState} from "../player/setPlayingState";
import {PlayerService} from "../../services/PlayerService";
import {PlayerState} from "../player/playerSlice";

const playerService = PlayerService.instance();

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
      dispatch(setStatus(RevoicerStatus.Splitting));


      await revoicerService.split(file, async (outputFile) => {
        console.log("Split Response received: ", outputFile);
        let previousState = getState().player.state;

        let values = updateFile(files, outputFile);
        dispatch(setSongFiles(values));
        dispatch(setStatus(RevoicerStatus.Split));

        await dispatch(setPlayingState(PlayerState.Paused));
        playerService.setTime(0);

        setTimeout(async () => {
          playerService.mutePlayer("originalAudioPlayer", true);
          await dispatch(setPlayingState(previousState));
        }, 1000);
      });
    }
  };
}
