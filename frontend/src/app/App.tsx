import React from 'react';
import './App.css';
import {Box, Button, Container, CssBaseline, MenuItem, Select, ThemeProvider, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {AppToolbar} from "../molecules/AppToolbar/AppToolbar";
import {RevoicerStatus, setVoice} from "../features/revoicer/revoicerSlice";
import {useAppDispatch, useAppSelector} from "./hooks";
import {changeFiles, uploadFiles} from "../features/revoicer/changeFiles";
import {splitSongs} from "../features/splitter/splitSongs";
import {revoiceSongs} from "../features/splitter/revoiceSongs";
import {ButtonsConfig} from "./ButtonsConfig";
import {SongList} from "../molecules/SongList";
import {PlayArrow} from "@mui/icons-material";
import {revoicerTheme} from "../theme/revoicerTheme";
import {UploadStep} from "../organisms/UploadStep";

const theme = revoicerTheme();

function play(indexesToPlay: number[]) {
  let players = [...document.getElementsByClassName("react-audio-player")].map(item => item as HTMLAudioElement);

  for (let player of players) {
    player.currentTime = 0;
    player.pause();
  }

  for (let index of indexesToPlay) {
    players[index].play();
  }
}

function App() {
  const dispatch = useAppDispatch();
  const files = useAppSelector(state => state.revoicer.uploadedFiles);
  const voice = useAppSelector(state => state.revoicer.voice);
  const status = useAppSelector(state => state.revoicer.status);

  const inputFiles = files.filter(file => file.input?.length > 0);
  const splitFiles = files.filter(file => file.split?.length > 0);
  const revoicedFiles = files.filter(file => file.revoiced?.length > 0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AppToolbar/>
      <main>
        <Box>
          <Container>
            <form>
              <UploadStep
                onFilesSelected={(files) => dispatch(changeFiles(files))} jobs={files} status={status}
                onUploadClick={() => dispatch(uploadFiles())} files={inputFiles}
              />
              <Box>
                <Typography variant={"h1"}>Uploaded</Typography>
                <Button
                  variant={"outlined"}
                  color={"primary"}
                  disabled={ButtonsConfig.splitButtonDisabledWhen.includes(status)}
                  onClick={() => dispatch(splitSongs())}
                >Split</Button>
                <LoadingButton
                  loading={status === RevoicerStatus.Splitting}
                />

                <SongList
                  files={splitFiles}
                  type={"split"}
                />
              </Box>
              <Box>
                <Typography variant={"h1"}>Revoice</Typography>
                <Select
                  onChange={(event) => dispatch(setVoice(event.target.value as string))}
                  value={voice}
                  disabled={ButtonsConfig.revoiceButtonDisabledWhen.includes(status)}
                  size={"small"}
                >
                  <MenuItem value={"BillieJoe"}>Billie Joe</MenuItem>
                  <MenuItem value={"ChrisCornell"}>Chris Cornell</MenuItem>
                  <MenuItem value={"DavidBowie"}>David Bowie</MenuItem>
                  <MenuItem value={"EddieVedder"}>Eddie Vedder</MenuItem>
                  <MenuItem value={"EricCartman"}>Eric Cartman</MenuItem>
                  <MenuItem value={"JamesHetfield"}>James Hetfield</MenuItem>
                  <MenuItem value={"LadyGaga"}>Lady Gaga</MenuItem>
                  <MenuItem value={"LiamGallagher"}>Liam Gallagher</MenuItem>
                  <MenuItem value={"MarinaSena"}>Marina Sena</MenuItem>
                  <MenuItem value={"NoelGallagher"}>Noel Gallagher</MenuItem>
                  <MenuItem value={"ParapperTheRapper"}>Parapper The Rapper</MenuItem>
                  <MenuItem value={"PhilAnselmo"}>Phil Anselmo</MenuItem>
                  <MenuItem value={"StevieRayVaughan"}>Stevie Ray Vaughan</MenuItem>
                  <MenuItem value={"TimMaia"}>Tim Maia</MenuItem>
                </Select>

                <Button
                  variant={"outlined"}
                  color={"primary"}
                  disabled={ButtonsConfig.revoiceButtonDisabledWhen.includes(status)}
                  onClick={() => dispatch(revoiceSongs())}
                >Revoice</Button>
                <LoadingButton
                  loading={status === RevoicerStatus.Revoicing}
                />
              </Box>

              <SongList
                files={revoicedFiles}
                type={"revoiced"}
              />

              <Box>
                <Button
                  variant={"contained"}
                  color={"success"}
                  disabled={status !== RevoicerStatus.Revoiced}
                  onClick={() => play([1, 3])}
                ><PlayArrow/> Revoiced vocals</Button>

                <Button
                  variant={"contained"}
                  color={"warning"}
                  disabled={status !== RevoicerStatus.Revoiced}
                  onClick={() => play([1, 2])}
                ><PlayArrow/> Original vocals</Button>
              </Box>
            </form>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}

export default App;

