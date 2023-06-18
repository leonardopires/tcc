import {Box, Button, Grid, Typography} from "@mui/material";
import {Logo} from "../atoms/Logo/Logo.tsx";
import {Link} from "react-router-dom";

export function HomePage() {
  return <Box>
    <Grid container columns={9}>
      <Grid item xs={8} sm={6} paddingTop={"30%"}>
        <Logo width={"80%"}/>
      </Grid>
      <Grid item xs={7} sm={5} paddingTop={"10%"}>
        <Typography variant={"h2"}>
          A reinvenção da voz em um clique.
        </Typography>
        <p>
          <Typography variant={"caption"}>Revoicer é um trabalho de conclusão de curso de Sistemas de
            Informação
            na <a href={"https://www.feevale.br/"} target={"_blank"}>Universidade Feevale</a></Typography>
        </p>
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
  </Box>;
}