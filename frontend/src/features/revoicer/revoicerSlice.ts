import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IRevoiceJob} from "./IRevoiceJob";
import {RevoicerStatus} from "./revoicerStatus";
import {IRevoicerState} from "./IRevoicerState";


/**
 * Represents the initial state for the revoicerSlice.
 * @type {IRevoicerState}
 * @constant
 */
const initialState: IRevoicerState = {
  voice: undefined,
  status: RevoicerStatus.Empty,
  uploadedFiles: [],
  voices: [
    {id: "marcoc2/BillieJoe/Dookie", name: "Billie Joe (Green Day)"},
    {id: "marcoc2/ChrisCornell", name: "Chris Cornell (Soundgarden, Audioslave)"},
    {id: "marcoc2/DaveMustaine", name: "Dave Mustaine (Megadeth)"},
    {id: "marcoc2/DavidBowie", name: "David Bowie"},
    {id: "marcoc2/EddieVedder", name: "Eddie Vedder (Pearl Jam)"},
    {id: "marcoc2/EricCartman", name: "Eric Cartman (South Park)"},
    {id: "quickwick/FreddieMercury", name: "Freddie Mercury (Queen)"},
    {id: "quickwick/GeorgeHarrison", name: "George Harrison (The Beatles)"},
    {id: "marcoc2/JamesHetfield", name: "James Hetfield (Metallica)"},
    {id: "quickwick/JohnLennon", name: "John Lennon (The Beatles)"},
    {id: "quickwick/KatyPerry", name: "Katy Perry"},
    {id: "marcoc2/LadyGaga", name: "Lady Gaga"},
    {id: "marcoc2/LiamGallagher", name: "Liam Gallagher (Oasis)"},
    {id: "quickwick/MarkHoppus", name: "Mark Hoppus (Blink-182)"},
    {id: "marcoc2/NoelGallagher", name: "Noel Gallagher (Oasis)"},
    {id: "quickwick/PaulMcCartney", name: "Paul McCartney (The Beatles)"},
    {id: "marcoc2/PhilAnselmo", name: "Phil Anselmo (Pantera)"},
    {id: "quickwick/RingoStarr", name: "Ringo Starr (The Beatles)"},
    {id: "quickwick/Shakira", name: "Shakira"},
    {id: "quickwick/MichaelJackson", name: "Michael Jackson"},
    {id: "quickwick/HayleyWilliams", name: "Hayley Williams (Paramore)"},
    {id: "marcoc2/StevieRayVaughan", name: "Stevie Ray Vaughan"},
    {id: "quickwick/TaylorSwift", name: "Taylor Swift"},
    {id: "marcoc2/TimMaia", name: "Tim Maia"},
  ].sort((item1, item2) => item1.name === item2.name ? 0 : (item1.name < item2.name ? -1 : 1)),
};

/**
 * Defines the redux slice for the revoicer functionality.
 */
export const revoicerSlice = createSlice({
  name: "uploadSongs",
  initialState,
  reducers: {
    /**
     * Sets the song files for revoicing.
     * @param {IRevoicerState} state - The current state.
     * @param {PayloadAction<IRevoiceJob[]>} action - The action containing the payload.
     */

    setSongFiles: (state, action: PayloadAction<IRevoiceJob[]>) => {
      state.uploadedFiles = action.payload ?? [];
    },
    /**
     * Sets the voice for revoicing.
     * @param {IRevoicerState} state - The current state.
     * @param {PayloadAction<string|undefined>} action - The action containing the payload.
     */
    setVoice: (state, action: PayloadAction<string | undefined>) => {
      state.voice = action.payload;
      for (let file of state.uploadedFiles) {
        file.voice = action.payload;
      }
    },
    /**
     * Sets the status of the revoicer.
     * @param {IRevoicerState} state - The current state.
     * @param {PayloadAction<RevoicerStatus>} action - The action containing the payload.
     */
    setStatus: (state, action: PayloadAction<RevoicerStatus>) => {
      state.status = action.payload;
    },
    /**
     * Sets the song info for revoicing.
     * @param {IRevoicerState} state - The current state.
     * @param {PayloadAction} action - The action containing the payload.
     */
    setSongInfo: (state, action) => {
      state.songInfo = action.payload;
    },
    /**
     * Sets the artwork of the song used for revoicing.
     * @param {IRevoicerState} state - The current state.
     * @param {PayloadAction} action - The action containing the payload.
     */
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

