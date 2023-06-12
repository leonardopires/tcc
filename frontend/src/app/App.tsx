import React from 'react';
import './App.css';
import {Box, Container, CssBaseline, ThemeProvider} from "@mui/material";
import {AppToolbar} from "../ui/molecules/AppToolbar/AppToolbar";
import {useAppSelector} from "./hooks";
import {revoicerTheme} from "../ui/theme/revoicerTheme";
import {UploadStep} from "../ui/organisms/UploadStep";
import {MultiTrackStep} from "../ui/organisms/MultiTrackStep";
import {RevoicerStatus} from "../features/revoicer/revoicerStatus";

const theme = revoicerTheme();


function App() {
  const status = useAppSelector(state => state.revoicer.status);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AppToolbar/>
      <main>
        <Box>
          <Container>
            <form>
              <UploadStep condition={status < RevoicerStatus.Split}/>
              <MultiTrackStep condition={status >= RevoicerStatus.Split}/>

            </form>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}

export default App;

