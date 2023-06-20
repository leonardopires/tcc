import {Box, Button, Grid, Typography} from "@mui/material";
import {Logo} from "../atoms/Logo/Logo.tsx";
import {Link} from "react-router-dom";

export function HomePage() {
  return (
    <Box>
      <Grid container columns={9}>
        <Grid item xs={8} sm={6} paddingTop={"20%"}>
          <Logo width={"80%"}/>
        </Grid>
        <Grid item xs={7} sm={5} paddingTop={"10%"}>
          <Typography variant={"h2"}>
            A reinvenção da voz em um clique.
          </Typography>
          <Typography variant={"h5"}>
            Separe uma música em diversos canais, mude a voz e tenha liberdade total para criar!
          </Typography>
          <Box sx={{mt: 2}}>
            <Typography variant={"caption"}>
              O <b>Revoicer</b> é um software que se utiliza do que há de mais avançado em Inteligência Artificial (IA)
              para realizar a extração e separação das trilhas referentes a cada categoria de instrumentos em uma música
              e também a substituição da voz do cantor original pela voz de cantores famosos.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
        </Grid>
      </Grid>
      <Grid container columns={9}>
        <Grid item xs={4} paddingTop={"10%"}>
          <Link to={"/upload"}>
            <Button variant={"contained"} fullWidth>Iniciar</Button>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}