import {Typography} from "@mui/material";

export function Footer() {
  return (
    <footer style={{bottom: 0, position: "relative", marginBottom: "20px", marginTop: "auto", height:"auto"}}>
      <p>
        <Typography variant={"caption"}>
          &copy; 2023 - <a href={"http://ludikore.com"} target={"_blank"}>Leonardo Petersen Thomé Pires</a>
        </Typography>
      </p>
      <p>
        <Typography
          fontStyle={"italic"}
          fontSize={"7pt"}
        >Os arquivos e músicas enviados para este
          site
          são de inteira responsabilidade de quem fez o envio.
          Use apenas músicas que você tenha adquirido legalmente e/ou detenha os direitos autorais e ou
          de cópia.</Typography>
      </p>
    </footer>
  );
}