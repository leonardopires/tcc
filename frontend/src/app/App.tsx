import React from 'react';
import './App.css';
import {Box, Container, createTheme, CssBaseline, ThemeProvider, Typography} from "@mui/material";
import {AppToolbar} from "../molecules/AppToolbar";
import {FileSelector} from "../atoms/FileSelector";
import {setSongFiles} from "../features/uploadSong/uploadSongsSlice";
import {useAppDispatch, useAppSelector} from "./hooks";
import {uploadSongFiles} from "../features/uploadSong/uploadSongFiles";


const theme = createTheme();

function App() {
  const dispatch = useAppDispatch();

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
              />
            </form>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}

export default App;
