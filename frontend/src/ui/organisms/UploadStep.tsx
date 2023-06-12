import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";
import React from "react";
import {Box, Button, Grid, Typography} from "@mui/material";
import {FileSelector} from "../molecules/FileSelector/FileSelector";
import {LoadingButton} from "@mui/lab";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {DeleteIcon} from "../atoms/DeleteIcon/DeleteIcon";
import {filesChanged} from "../../features/splitter/filesChanged";
import {uploadAndSplit} from "../../features/revoicer/uploadAndSplit";

import {Player, PlayerSize} from "./Player";
import {RevoicerStatus} from "../../features/revoicer/revoicerStatus";


export function UploadStep(props: {condition: boolean}) {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(state => state.revoicer.uploadedFiles);
  const status = useAppSelector(state => state.revoicer.status);

  const songInfo = useAppSelector(state => state.revoicer.songInfo);

  let job = jobs[0];

  let onUploadClick = () => dispatch(uploadAndSplit());


  return props.condition ? (
    <Box>
      <Typography variant={"h1"}>Upload & Split</Typography>
      <FileSelector
        id={"song"}
        onChange={(files) => dispatch(filesChanged(files))}
        canAdd={jobs.length === 0}
        files={jobs.map(item => item as any as ExtendedFileProps)}
      />
      {(jobs.length > 0 && songInfo) ? (
        <>
          <Player size={PlayerSize.XLarge} id={"originalAudioPlayer"} muted={job?.split?.length > 0 || job?.revoiced?.length > 0} />
          <Grid container columns={10} position={"absolute"} bottom={10} left={0} right={0} paddingX={2}>
            <Grid item xs={1}>
              <Button
                variant={"outlined"}
                onClick={() => window.location.reload()}
                disabled={status >= RevoicerStatus.Uploading}
              >
                <DeleteIcon size={20}/>
              </Button>
            </Grid>
            <Grid item xs={9} paddingLeft={"1em"}>
              <LoadingButton
                variant={"contained"}
                color={"primary"}
                disabled={status >= RevoicerStatus.Uploading}
                onClick={onUploadClick}
                loading={status >= RevoicerStatus.Uploading && status <= RevoicerStatus.Splitting}
                fullWidth
              >{status >= RevoicerStatus.Uploading ? RevoicerStatus[status] : "Start"}</LoadingButton>
            </Grid>
          </Grid>
        </>
      ) : ""}
    </Box>
  ) : (<></>);
};