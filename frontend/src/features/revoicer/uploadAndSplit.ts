import {uploadFiles} from "./changeFiles";
import {splitSongs} from "../splitter/splitSongs";
import {setPlayingState} from "../player/setPlayingState";
import {PlayerState} from "../player/playerSlice";
import {AppThunk} from "../../ui/app/store.ts";

export function uploadAndSplit(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    let previousState = getState().player.state;

    await dispatch(setPlayingState(PlayerState.Paused));
    await dispatch(uploadFiles());
    await dispatch(setPlayingState(previousState));
    await dispatch(splitSongs());
  };
}

