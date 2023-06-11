import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IID3Tag, IID3V1Tag, IID3V2Tag} from "id3-parser/lib/interface";

export interface IVoice {
  name: string,
  id: string,
}

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

export interface IRevoicerState {
  voice: string,
  status: RevoicerStatus,
  uploadedFiles: IRevoiceJob[];
  songInfo?: IID3Tag,
  artwork?: string,
  voices: IVoice[];
}

const initialState: IRevoicerState = {
  voice: "LiamGallagher",
  status: RevoicerStatus.Empty,
  uploadedFiles: [],
  voices: [
    {id: "BillieJoe", name: "Billie Joe"},
    {id: "ChrisCornell", name: "Chris Cornell"},
    {id: "DavidBowie", name: "David Bowie"},
    {id: "EddieVedder", name: "Eddie Vedder"},
    {id: "EricCartman", name: "Eric Cartman"},
    {id: "JamesHetfield", name: "James Hetfield"},
    {id: "LadyGaga", name: "Lady Gaga"},
    {id: "LiamGallagher", name: "Liam Gallagher"},
    {id: "MarinaSena", name: "Marina Sena"},
    {id: "NoelGallagher", name: "Noel Gallagher"},
    {id: "ParapperTheRapper", name: "Parapper The Rapper"},
    {id: "PhilAnselmo", name: "Phil Anselmo"},
    {id: "StevieRayVaughan", name: "Stevie Ray Vaughan"},
    {id: "TimMaia", name: "Tim Maia"},
  ],
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
    setSongInfo: (state, action) => {
      state.songInfo = action.payload;
    },
    setArtwork: (state, action) => {
      state.artwork = action.payload;
    }
  },
});

export const {
  setSongFiles,
  setVoice,
  setStatus,
  setSongInfo,
  setArtwork,
} = revoicerSlice.actions;
export const revoicerSliceReducer = revoicerSlice.reducer;

