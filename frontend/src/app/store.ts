import {AnyAction, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {uploadSongsSliceReducer} from "../features/uploadSong/uploadSongsSlice";

export const store = configureStore({
  reducer: {
    uploadSong: uploadSongsSliceReducer
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