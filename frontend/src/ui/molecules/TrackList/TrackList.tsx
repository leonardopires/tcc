import React from "react";
import {Track} from "../Track/Track";
import {getTrackInfo} from "../Track/GetTrackInfo";
import {IVoice} from "../../../features/revoicer/IVoice";
import {TrackType} from "../../../features/revoicer/TrackType";
import {Box, Typography} from "@mui/material";


export function TrackList({files, voices}: { files: string[], voices: IVoice[] }) {
  let tracks = files.filter(childFile => childFile.endsWith(".aac") || childFile.endsWith(".mp3"))
    .map(file => getTrackInfo(file, voices));

  return (
    <>
      <Typography variant={"h4"}>Vocais</Typography>
      <Box>
        {tracks.filter(track => track.type === TrackType.Vocal)
          .map(track => {
            return <Track key={track.id} track={track}/>;
          })}
      </Box>
      <Typography variant={"h4"}>Instrumentos</Typography>
      <Box>
        {tracks.filter(track => track.type === TrackType.Instrument)
          .map(track => {
            return <Track key={track.id} track={track}/>;
          })}
      </Box>
    </>
  );
}
