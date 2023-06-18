import {setPlayerTrackVolume} from "./playerSlice";
import {PlayerService} from "../../services/PlayerService";
import {AppThunk} from "../../ui/app/store.ts";

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