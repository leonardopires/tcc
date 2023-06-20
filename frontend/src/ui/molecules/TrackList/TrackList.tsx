import {Track} from "../Track/Track";
import {getTrackInfo} from "../Track/GetTrackInfo";
import {IVoice} from "../../../features/revoicer/IVoice";
import {TrackType} from "../../../features/revoicer/TrackType";
import {Box, Grid, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {revoiceSongs} from "../../../features/splitter/revoiceSongs";
import {setVoice} from "../../../features/revoicer/revoicerSlice";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {RevoicerStatus} from "../../../features/revoicer/revoicerStatus";


export function TrackList({files, voices}: { files: string[], voices: IVoice[] }) {
  let tracks = files.filter(childFile => childFile.endsWith(".mp3"))
    .map(file => getTrackInfo(file, voices))
    .sort((file1, file2) => ((file1?.priority ?? 99) - (file2.priority ?? 99)));

  const voice = useAppSelector(state => state.revoicer.voice);
  const status = useAppSelector(state => state.revoicer.status);

  const dispatch = useAppDispatch();
  const handleClick = () => dispatch(revoiceSongs());

  const onChange = (event: SelectChangeEvent) => dispatch(setVoice(event.target.value as string));


  return (
    <>
      <Typography variant={"h4"}>Vocais</Typography>
      <Box>
        {tracks.filter(track => track.type === TrackType.Vocal)
          .map(track => {
            return <Track key={track.id} track={track}/>;
          })}
      </Box>
      <Box marginTop={"1em"}>
        <Grid container columns={8}>
          <Grid item xs={8}>
            <Typography variant={"caption"}>Selecione um novo vocalista para esta música: </Typography>
          </Grid>
          <Grid item
                xs={8}
                sm={6}
                md={6}
                paddingRight={"10px"}
                paddingBottom={"5px"}
          >
            <Select
              onChange={onChange}
              value={voice ?? ""}
              size={"small"}
              variant={"outlined"}
              fullWidth={true}
              disabled={status === RevoicerStatus.Revoicing}
            >
              {voices
                .filter(voice => !tracks.some(track => track.id === voice.id))
                .map(voice => <MenuItem value={voice.id} key={voice.id}>{voice.name}</MenuItem>)}
            </Select>
          </Grid>
          <Grid item
                xs={8}
                sm={2}
                md={2}
                textAlign={"center"}
                paddingRight={"10px"}
          >

            <LoadingButton
              variant={"contained"}
              color={"primary"}
              onClick={handleClick}
              loading={status === RevoicerStatus.Revoicing}
              disabled={!voice}
              loadingPosition={"end"}
              fullWidth={true}
              endIcon={<></>}
            >{status === RevoicerStatus.Revoicing ? "Aguarde..." : "Processar"}
            </LoadingButton>
          </Grid>
        </Grid>
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
