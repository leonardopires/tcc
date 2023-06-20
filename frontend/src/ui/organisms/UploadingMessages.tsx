import {RevoicerStatus} from "../../features/revoicer/revoicerStatus.ts";
import {Box, Grid, LinearProgress, Paper, Typography} from "@mui/material";

export function UploadingMessages(props: { status: RevoicerStatus }) {
  return props.status >= RevoicerStatus.Uploading && props.status < RevoicerStatus.Split ? (
    <Grid container columns={7} marginTop={"10%"}>
      <Grid item xs={0} sm={1} md={1} lg={2}></Grid>
      <Grid item xs={7} sm={5} md={5} lg={3}>
        <Paper style={{padding: "20px 10px", borderRadius: "20px"}} variant={"elevation"}>
          <Box marginLeft={2} marginRight={2}>
            <Typography
              variant={"h6"}
            >
              {props.status < RevoicerStatus.Splitting ? (
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
              {props.status < RevoicerStatus.Splitting ? (
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
  ) : (
    <></>
  );
}