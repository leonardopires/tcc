import {RevoicerStatus} from "../../features/revoicer/revoicerStatus.ts";
import {IRevoiceJob} from "../../features/revoicer/IRevoiceJob.ts";
import {Box, Grid} from "@mui/material";
import {Player, PlayerSize} from "./Player.tsx";
import {UploadingMessages} from "./UploadingMessages.tsx";
import {UploadActionBar} from "./UploadActionBar.tsx";
import {Navigate} from "react-router-dom";

export function BeginSplitStep(props: {
  status: RevoicerStatus,
  job: IRevoiceJob,
  onStart: () => void,
  onDiscard: () => void
}) {
  return <>
    <Grid container columns={7} marginTop={"10%"}>
      <Grid item xs={7}>
        <Player
          size={props.status < RevoicerStatus.Uploading ? PlayerSize.XLarge : PlayerSize.Medium}
          id={"originalAudioPlayer"}
          muted={props.job?.split?.length > 0 || props.job?.revoiced?.length > 0}
        />
      </Grid>
    </Grid>

    <UploadingMessages status={props.status}/>

    <Box sx={{mt: 10}}>
      {props.status <= RevoicerStatus.Splitting ? (
        <UploadActionBar
          onStart={props.onStart}
          status={props.status}
          onDiscard={props.onDiscard}
        />
      ) : (
        <Navigate to={"/revoice"}/>
      )}
    </Box>
  </>;
}