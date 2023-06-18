import {AnyAction, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {revoicerSliceReducer} from "../../features/revoicer/revoicerSlice";
import {playerSliceReducer} from "../../features/player/playerSlice";

export const store = configureStore({
  reducer: {
    revoicer: revoicerSliceReducer,
    player: playerSliceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;