import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface IRevoiceJob {
  contentType?: string;
  jobId?: string;
  voice: string;
  name: string;
  filePath?: string;
  size: number;
  path: string;
  type: string;
  extension: string | undefined;
  lastModified?: string | Date;
  lastModifiedDate?: string | Date;
  separatedFiles: string[];
  updatedVocals: string[];
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
  voice: "NoelGallagher",
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

