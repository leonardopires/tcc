import {PlayerState, setPlayerState} from "./playerSlice";
import {PlayerService} from "../../services/PlayerService";
import {AppThunk} from "../../ui/app/store.ts";

const playerService = PlayerService.instance();

export function setPlayingState(playerState: PlayerState): AppThunk<Promise<void>> {
  return async (dispatch) => {

    if (playerState === PlayerState.Playing) {
      await playerService.playAll();
      dispatch(setPlayerState(PlayerState.Playing));
    } else if (playerState === PlayerState.Paused) {
      await playerService.pauseAll();
      dispatch(setPlayerState(PlayerState.Paused));
    }
  };
}