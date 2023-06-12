import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {revoiceSongs} from "../../features/splitter/revoiceSongs";
import {Box, Button, Grid, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import {setVoice} from "../../features/revoicer/revoicerSlice";
import {AddCircleOutline} from "@mui/icons-material";
import {Player, PlayerSize} from "./Player";
import {ButtonsConfig} from "../../app/ButtonsConfig";
import {LoadingButton} from "@mui/lab";
import {TrackList} from "../molecules/TrackList";
import React from "react";
import {RevoicerStatus} from "../../features/revoicer/revoicerStatus";

export function MultiTrackStep({condition}: { condition: boolean }) {
  const dispatch = useAppDispatch();
  const files = useAppSelector(state => state.revoicer.uploadedFiles);
  const voice = useAppSelector(state => state.revoicer.voice);
  const status = useAppSelector(state => state.revoicer.status);

  const splitFiles = files.flatMap(file => file.split);
  const revoicedFiles = files.flatMap(file => file.revoiced);

  const voices = useAppSelector(state => state.revoicer.voices);

  const handleClick = () => dispatch(revoiceSongs());

  const onChange = (event: SelectChangeEvent) => dispatch(setVoice(event.target.value as string));

  return condition ? (
    <Box>
      <Grid container columns={10}>
        <Grid item xs={8}>
          <Typography variant={"h3"} marginBottom={"1em"} marginTop={"0.3em"}>Revoice</Typography>
        </Grid>
        <Grid item xs={2} textAlign={"right"}>
          <Button variant={"outlined"} onClick={() => window.location.reload()}>
            <AddCircleOutline/> <Box marginLeft={"5px"}>Novo</Box>
          </Button>
        </Grid>
      </Grid>
      <Player
        size={PlayerSize.Medium}
        style={{marginBottom: "2em"}}
        id={"originalAudioPlayer2"}
        muted={true}
      />

      {(status >= RevoicerStatus.Split) ? (
        <>
          <Box>
            <TrackList
              files={[...revoicedFiles, ...splitFiles]}
              voices={voices}
            />
          </Box>
          {status < RevoicerStatus.Revoiced ? (
            <Box marginTop={"1em"} position={"absolute"} bottom={0} left={0}>
              <Select
                onChange={onChange}
                value={voice}
                disabled={ButtonsConfig.revoiceButtonDisabledWhen.includes(status)}
                size={"small"}
              >
                {voices.map(voice => <MenuItem value={voice.id} key={voice.id}>{voice.name}</MenuItem>)}
              </Select>

              <LoadingButton
                variant={"outlined"}
                color={"primary"}
                disabled={ButtonsConfig.revoiceButtonDisabledWhen.includes(status)}
                onClick={handleClick}

                loading={status === RevoicerStatus.Revoicing}
              >{status >= RevoicerStatus.Revoicing ? RevoicerStatus[status] : "Revoice"}
              </LoadingButton>
            </Box>
          ) : (<></>)}
        </>
      ) : (
        <></>
      )}
    </Box>
  ) : <></>;
}