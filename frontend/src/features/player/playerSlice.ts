import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export enum PlayerState {
  Paused,
  Playing,
}

export interface ITrackState {
  id: string,
  src?: string,
  volume: number,
}

export interface IPlayerState {
  state: PlayerState;
  duration: number;
  tracks: ITrackState[];
}

const initialState: IPlayerState = {
  state: PlayerState.Paused,
  duration: 0,
  tracks: [],
};
export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayerState(state, action: PayloadAction<PlayerState>) {
      state.state = action.payload;
    },
    setPlayerDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
    setPlayerTrackVolume(state, action: PayloadAction<{ id: string, volume: number }>) {
      let track = state.tracks.find(track => track.id === action.payload.id);
      if (track) {
        track.volume = action.payload.volume;
      }
    },
    setPlayerTrack(state, action: PayloadAction<ITrackState>) {
      let track = state.tracks.find(track => track.id === action.payload.id);
      if (track) {
        track.src = action.payload.src;
        track.volume = action.payload.volume;
      } else {
        state.tracks.push(action.payload);
      }
    },
  },
});

export const {
  setPlayerState,
  setPlayerDuration,
  setPlayerTrackVolume,
  setPlayerTrack,
} = playerSlice.actions;

export const playerSliceReducer = playerSlice.reducer;