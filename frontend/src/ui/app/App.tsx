import './App.scss';
import {CssBaseline, ThemeProvider} from "@mui/material";
import {revoicerTheme} from "../theme/revoicerTheme.ts";
import {Outlet} from "react-router-dom";


const theme = revoicerTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Outlet/>
    </ThemeProvider>
  )
    ;
}

export default App;

