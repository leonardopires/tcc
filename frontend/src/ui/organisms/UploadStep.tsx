import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";
import React from "react";
import {Box, Button, CircularProgress, Grid, LinearProgress, Paper, Typography} from "@mui/material";
import {FileSelector} from "../molecules/FileSelector/FileSelector";
import {LoadingButton} from "@mui/lab";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {DeleteIcon} from "../atoms/DeleteIcon/DeleteIcon";
import {filesChanged} from "../../features/splitter/filesChanged";
import {uploadAndSplit} from "../../features/revoicer/uploadAndSplit";

import {Player, PlayerSize} from "./Player";
import {RevoicerStatus} from "../../features/revoicer/revoicerStatus";
import {HorizontalRule} from "@mui/icons-material";
import {orange} from "@mui/material/colors";


export function UploadStep(props: { condition: boolean }) {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(state => state.revoicer.uploadedFiles);
  const status = useAppSelector(state => state.revoicer.status);

  const songInfo = useAppSelector(state => state.revoicer.songInfo);

  let job = jobs[0];

  let onUploadClick = () => dispatch(uploadAndSplit());


  return props.condition ? (
    <Box>
      <Typography variant={"h2"}>Upload & Split</Typography>
      <FileSelector
        id={"song"}
        onChange={(files) => dispatch(filesChanged(files))}
        canAdd={jobs.length === 0}
        files={jobs.map(item => item as any as ExtendedFileProps)}
      />
      {(jobs.length > 0 && songInfo) ? (
        <>
          <Player
            size={status < RevoicerStatus.Uploading ? PlayerSize.XLarge : PlayerSize.Medium}
            id={"originalAudioPlayer"}
            muted={job?.split?.length > 0 || job?.revoiced?.length > 0}
          />
          {status >= RevoicerStatus.Uploading ? (
            <Grid container columns={7} marginTop={"10%"}>
              <Grid item xs={1} sm={2} md={2} lg={2}></Grid>
              <Grid item xs={5} sm={3} md={3} lg={3}>
                <Paper style={{padding: "20px 10px", borderRadius: "20px"}} variant={"elevation"}>
                  <Box marginLeft={2} marginRight={2}>
                    <Typography
                      variant={"h6"}
                    >
                      {status < RevoicerStatus.Splitting ? (
                        <p>Fazendo o upload do arquivo e preparando o terreno...</p>
                      ) : (
                        <p>Aguarde enquanto separamos os vocais e os instrumentos da música...</p>
                      )}
                    </Typography>
                  </Box>
                  <center>
                    <Box>
                      <LinearProgress
                        variant={"indeterminate"}
                        color={"success"}
                        value={100}
                      />
                    </Box>
                  </center>
                </Paper>
                <Paper
                  style={{padding: "10px 10px", borderRadius: "20px", marginTop: "5px"}}
                  variant={"outlined"}
                >

                  <Box marginLeft={3} marginRight={3}>
                    <Typography
                      variant={"caption"}
                    >
                      {status < RevoicerStatus.Splitting ? (
                        <p><b>Dica</b>:<br/> Aguarde um momento e logo você poderá escutar a música.</p>
                      ) : (
                        <p><b>Dica</b>:<br/>Você já pode escutar a música enquanto espera.</p>

                      )}

                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={3} sm={1}></Grid>
            </Grid>
          ) : (<></>)}
          {status < RevoicerStatus.Splitting ? (
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
                  loadingPosition={"end"}
                  onClick={onUploadClick}
                  endIcon={<></>}
                  loading={status >= RevoicerStatus.Uploading && status <= RevoicerStatus.Splitting}
                  fullWidth
                >{status >= RevoicerStatus.Uploading ? "Preparando..." : "Iniciar"}</LoadingButton>
              </Grid>
            </Grid>
          ) : (<></>)}
        </>
      ) : ""}
    </Box>
  ) : (<></>);
};