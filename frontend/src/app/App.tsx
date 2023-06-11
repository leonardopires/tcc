import React from 'react';
import './App.css';
import {Box, Container, CssBaseline, ThemeProvider} from "@mui/material";
import {AppToolbar} from "../ui/molecules/AppToolbar/AppToolbar";
import {RevoicerStatus} from "../features/revoicer/revoicerSlice";
import {useAppSelector} from "./hooks";
import {revoicerTheme} from "../ui/theme/revoicerTheme";
import {SplitStep} from "../ui/organisms/SplitStep";
import {MultiTrackStep} from "../ui/organisms/MultiTrackStep";

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
              <SplitStep condition={status < RevoicerStatus.Split}/>
              <MultiTrackStep condition={status >= RevoicerStatus.Split}/>

            </form>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}

export default App;

