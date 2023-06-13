import {PlayerState, setPlayerState, setPlayerTrackVolume} from "./playerSlice";
import {AppThunk} from "../../app/store";
import {PlayerService} from "../../services/PlayerService";

const playerService = PlayerService.instance();

export function setTrackVolume(id: string, volume: number): AppThunk<Promise<void>> {
  return async (dispatch) => {

      let player = playerService.getPlayer(id);
      if (player) {
        player.volume = volume;
        dispatch(setPlayerTrackVolume({id, volume}))
      }
  };
}