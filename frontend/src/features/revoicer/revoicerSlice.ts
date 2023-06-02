import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface IRevoiceJob {
  contentType?: string;
  jobId?: string;
  operationId?: string;
  voice: string;
  name: string;
  filePath: string;
  size: number;
  type: string;
  extension: string | undefined;
  lastModified?: string | Date;
  lastModifiedDate?: string | Date;
  input: string[];
  split: string[];
  revoiced: string[];
  [index: string]: any;
}

export enum RevoicerStatus {
  Empty,
  FilesSelected,
  Uploading,
  Uploaded,
  Splitting,
  Split,
  Revoicing,
  Revoiced,
}

interface IRevoicerState {
  voice: string,
  status: RevoicerStatus,
  uploadedFiles: IRevoiceJob[];
}

const initialState: IRevoicerState = {
  voice: "LiamGallagher",
  status: RevoicerStatus.Empty,
  uploadedFiles: [],
};

export const revoicerSlice = createSlice({
  name: "uploadSongs",
  initialState,
  reducers: {
    setSongFiles: (state, action: PayloadAction<IRevoiceJob[]>) => {
      state.uploadedFiles = action.payload ?? [];
    },
    setVoice: (state, action: PayloadAction<string>) => {
      state.voice = action.payload;
      for (let file of state.uploadedFiles) {
        file.voice = action.payload;
      }
    },
    setStatus: (state, action: PayloadAction<RevoicerStatus>) => {
      state.status = action.payload;
    },
  },
});

export const {
  setSongFiles,
  setVoice,
  setStatus,
} = revoicerSlice.actions;
export const revoicerSliceReducer = revoicerSlice.reducer;

