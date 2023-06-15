import {useAppSelector} from "../../app/hooks";
import {
  Box,
  Button,
  Grid,
  Typography
} from "@mui/material";
import {AddCircleOutline, HorizontalRule} from "@mui/icons-material";
import {Player, PlayerSize} from "./Player";
import {TrackList} from "../molecules/TrackList";
import React from "react";
import {RevoicerStatus} from "../../features/revoicer/revoicerStatus";

/**
 * Renders the step of the revoicing process in which the user sees all the tracks from a song
 * and can mix them as they wish.
 * @param {object} props - The component props.
 * @param {boolean} props.condition - The condition determining whether to render the component.
 * @returns {JSX.Element} The rendered component.
 */
export function MultiTrackStep({condition}: { condition: boolean }) {
  const files = useAppSelector(state => state.revoicer.uploadedFiles);
  const status = useAppSelector(state => state.revoicer.status);

  const splitFiles = files.flatMap(file => file.split);
  const revoicedFiles = files.flatMap(file => file.revoiced);

  const voices = useAppSelector(state => state.revoicer.voices);

  return condition ? (
    <Box marginBottom={"20px"}>
      <Grid container columns={10}>
        <Grid item xs={8}>
          <Typography variant={"h3"} marginBottom={"1em"} marginTop={"0.3em"}>Revoice</Typography>
        </Grid>
        <Grid item xs={2} textAlign={"right"}>
          <Button variant={"outlined"} onClick={() => window.location.reload()}>
            <AddCircleOutline/> <Box marginLeft={"5px"}></Box> Novo
          </Button>
        </Grid>
      </Grid>
      <Player
        size={PlayerSize.Medium}
        style={{marginBottom: "2em"}}
        id={"mainAudioPlayer"}
        muted={splitFiles.length + revoicedFiles.length > 0}
      />

      {(status >= RevoicerStatus.Split) ? (
        <>
          <Box>
            <TrackList
              files={[...revoicedFiles, ...splitFiles]}
              voices={voices}
            />
          </Box>
        </>
      ) : (
        <></>
      )}
    </Box>
  ) : (
    <>
    </>
  );
}