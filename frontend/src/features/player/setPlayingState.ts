import {PlayerState, setPlayerState} from "./playerSlice";
import {AppThunk} from "../../app/store";
import {PlayerService} from "../../services/PlayerService";

const playerService = PlayerService.instance();

export function setPlayingState(playerState: PlayerState): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    let state = getState();


    if (playerState === PlayerState.Playing) {
      await playerService.playAll();
      dispatch(setPlayerState(PlayerState.Playing));
    } else {
      playerService.pauseAll();
      dispatch(setPlayerState(PlayerState.Paused));
    }
  };
}