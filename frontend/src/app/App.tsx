import React, {Fragment} from 'react';
import './App.css';
import {
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  MenuItem,
  Select,
  ThemeProvider,
  Typography
} from "@mui/material";
import {AppToolbar} from "../molecules/AppToolbar";
import {FileSelector} from "../atoms/FileSelector";
import {RevoicerStatus, setVoice} from "../features/revoicer/revoicerSlice";
import {useAppDispatch, useAppSelector} from "./hooks";
import {changeFiles, uploadFiles} from "../features/revoicer/changeFiles";
import {splitSongs} from "../features/splitter/splitSongs";
import {revoiceSongs} from "../features/splitter/revoiceSongs";
import ReactAudioPlayer from "react-audio-player";
import {AppConfig} from "../AppConfig";


const theme = createTheme();

function App() {
  const dispatch = useAppDispatch();
  const files = useAppSelector(state => state.revoicer.uploadedFiles);
  const voice = useAppSelector(state => state.revoicer.voice);
  const status = useAppSelector(state => state.revoicer.status);

  const splitFiles = files.filter(file => file.separatedFiles?.length > 0);
  const revoicedFiles = files.filter(file => file.updatedVocals?.length > 0);

  console.log(splitFiles);

  let uploadButtonDisabledWhen = [
    RevoicerStatus.Empty,
    RevoicerStatus.Uploading,
    RevoicerStatus.Uploaded,
    RevoicerStatus.Splitting,
    RevoicerStatus.Revoicing,
    RevoicerStatus.Splitting,
    RevoicerStatus.Split,
  ];
  let splitButtonDisabledWhen = [
    RevoicerStatus.Empty,
    RevoicerStatus.Uploading,
    RevoicerStatus.FilesSelected,
    RevoicerStatus.Splitting,
    RevoicerStatus.Revoicing,
  ];
  let revoiceButtonDisabledWhen = [
    RevoicerStatus.Empty,
    RevoicerStatus.Uploading,
    RevoicerStatus.Uploaded,
    RevoicerStatus.FilesSelected,
    RevoicerStatus.Splitting,
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AppToolbar/>
      <main>
        <Box sx={{bgcolor: "background.paper", pt: 8, pb: 6}}>
          <Container maxWidth={"sm"}>
            <Typography
              component={"p"}
              align={"center"}
              color={"text.primary"}
              gutterBottom
            >
              Upload a song and change the vocals
            </Typography>
          </Container>
        </Box>
        <Box>
          <Container>
            <form>
              <FileSelector
                id={"song"}
                onChange={(files) => dispatch(changeFiles(files))}
                canAdd={files.length === 0}
              />

              <Button
                variant={"outlined"}
                color={"primary"}
                disabled={uploadButtonDisabledWhen.includes(status)}
                onClick={() => dispatch(uploadFiles())}
              >Upload</Button>


              <Button
                variant={"outlined"}
                color={"primary"}
                disabled={splitButtonDisabledWhen.includes(status)}
                onClick={() => dispatch(splitSongs())}
              >Split</Button>

              {splitFiles.map(file => (
                <Fragment key={"split_" + file.name}>
                  <h3>{file.name}</h3>
                  <div>
                    {file.separatedFiles.map(splitFile => (
                      <div key={"split_" + splitFile}>
                        <h4>{splitFile}</h4>
                        <ReactAudioPlayer
                          src={`${AppConfig.api.baseURL}FileManager/download?filePath=${encodeURIComponent(splitFile)}`}
                          controls={true}
                        />
                      </div>
                    ))
                    }
                  </div>
                </Fragment>
              ))}

              <Typography
                color={"text.primary"}
              >
                Voice:
              </Typography>
              <Select
                onChange={(event) => dispatch(setVoice(event.target.value as string))}
                value={voice}
              >
                <MenuItem value={"ChrisCornell"}>Chris Cornell</MenuItem>
                <MenuItem value={"DavidBowie"}>David Bowie</MenuItem>
                <MenuItem value={"LiamGallagher"}>Liam Gallagher</MenuItem>
                <MenuItem value={"NoelGallagher"}>Noel Gallagher</MenuItem>
                <MenuItem value={"TimMaia"}>Tim Maia</MenuItem>
              </Select>

              <Button
                variant={"outlined"}
                color={"primary"}
                disabled={revoiceButtonDisabledWhen.includes(status)}
                onClick={() => dispatch(revoiceSongs())}
              >Revoice</Button>


              {revoicedFiles.map(file => (
                <Fragment key={"revoiced_" + file.name}>
                  <h3>{file.name}</h3>
                  <div>
                    {file.updatedVocals.map(revoicedFile => (
                      <div key={"revoiced_" + revoicedFile}>
                        <h4>{revoicedFile}</h4>
                        <ReactAudioPlayer
                          src={`${AppConfig.api.baseURL}FileManager/download?filePath=%2F${encodeURIComponent(revoicedFile)}`}
                          controls={true}
                        />
                      </div>
                    ))
                    }
                  </div>
                </Fragment>
              ))}


            </form>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}

export default App;

