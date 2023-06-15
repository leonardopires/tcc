import {AppThunk} from "../../app/store";
import {PlayerState, setPlayerState} from "./playerSlice";
import {PlayerService} from "../../services/PlayerService";

const playerService = PlayerService.instance();

export function togglePlayingState(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    let state = getState();

    let playerState = state.player.state;

    if (playerState === PlayerState.Playing) {
      await playerService.pauseAll();
      dispatch(setPlayerState(PlayerState.Paused));
    } else {
      await playerService.playAll();
      dispatch(setPlayerState(PlayerState.Playing));
    }
  };
}

