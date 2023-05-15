import React from 'react';
import './App.css';
import {Box, Button, Container, createTheme, CssBaseline, ThemeProvider, Typography} from "@mui/material";
import {AppToolbar} from "../molecules/AppToolbar";
import {FileSelector} from "../atoms/FileSelector";
import {setSongFiles} from "../features/uploadSong/uploadSongsSlice";
import {useAppDispatch, useAppSelector} from "./hooks";
import {uploadSongFiles} from "../features/uploadSong/uploadSongFiles";
import {splitSongs} from "../features/splitter/splitSongs";


const theme = createTheme();

function App() {
  const dispatch = useAppDispatch();
  const files = useAppSelector(state => state.uploadSong.uploadedFiles)

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
              Separate your song into multiple tracks
            </Typography>
          </Container>
        </Box>
        <Box>
          <Container>
            <form>
              <FileSelector
                id={"song"}
                onChange={(files) => dispatch(uploadSongFiles(files))}
                canAdd={files.length === 0}
              />
              <Button
                variant={"outlined"}
                color={"primary"}
                disabled={files.length === 0}
                onClick={() => dispatch(splitSongs(files))}
              >Split</Button>
            </form>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}

export default App;
