import {RevoicerStatus} from "../../features/revoicer/revoicerStatus.ts";
import {Button, Grid} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {DeleteIcon} from "../atoms/DeleteIcon/DeleteIcon.tsx";

export function UploadActionBar(props: {
  onStart: () => void,
  status: RevoicerStatus,
  onDiscard: () => void
}) {
  return props.status <= RevoicerStatus.Splitting ? (
    <Grid container columns={10}
               spacing={1}
               mx={{flexDirection: "row-reverse"}}
               sx={{
                 position: "relative",
                 paddingY: 6, paddingX: 2
               }}
  >
    <Grid item xs={10} sm={8} md={9} sx={{mt: 1}}>
      <LoadingButton
        variant={"contained"}
        color={"primary"}
        loadingPosition={"end"}
        onClick={props.onStart}
        endIcon={<></>}
        loading={props.status >= RevoicerStatus.Uploading && props.status <= RevoicerStatus.Splitting}
        fullWidth
      >{props.status >= RevoicerStatus.Uploading ? "Preparando..." : "Iniciar"}</LoadingButton>
    </Grid>
    <Grid item xs={10} sm={2} md={1} sx={{mt: 1}}>
      <Button
        variant={"outlined"}
        onClick={props.onDiscard}
        disabled={props.status >= RevoicerStatus.Uploading}
        fullWidth
      >
        <DeleteIcon size={20}/>
      </Button>
    </Grid>
  </Grid>
  ) : (
    <></>
  );
}