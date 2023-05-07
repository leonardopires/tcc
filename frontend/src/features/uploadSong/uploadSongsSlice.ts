import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";

export interface IFileDescriptor {
    name: string;
    size: number;
    path: string;
    type: string;
    lastModified?: string | Date;
    lastModifiedDate?: string | Date;
    extension: string | undefined;
}

interface IUploadSongState {
  uploadedFiles: IFileDescriptor[];
}

const initialState: IUploadSongState = {
  uploadedFiles: [],
};

export const uploadSongsSlice = createSlice({
  name: "uploadSongs",
  initialState,
  reducers: {
    setSongFiles: (state, action: PayloadAction<IFileDescriptor[]>)=> {
      {
        state.uploadedFiles = action.payload ?? [];
      }
    },
  },
});

export const { setSongFiles } = uploadSongsSlice.actions;
export const uploadSongsSliceReducer = uploadSongsSlice.reducer;

