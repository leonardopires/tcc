import {Card, CardContent, Typography} from "@mui/material";

export function UploadInstructions() {
  return <>
    <Card variant={"outlined"} sx={{mb: 2, textAlign: "justify"}}>
      <CardContent sx={{px: 4}}>
        <Typography variant={"h4"}>Como funciona?</Typography>
        <Typography variant={"caption"}>
          <p>
            Neste primeiro passo, você deve escolher um <b>arquivo de música<sup>1</sup></b> em
            formato <code>.mp3</code> para enviar para nossa inteligência artificial, que irá analisar os arquivos e
            separar a voz original dos
            demais
            instrumentos.
          </p>
          <p>
            Em um passo posterior você poderá escolher uma voz de um cantor famoso, que você poderá mixar livremente
            com
            ou sem a voz original.
          </p>
        </Typography>
      </CardContent>
      <CardContent sx={{pl: 6, pr: 5, textAlign: "justify"}}>
        <Typography variant={"caption"}>
          <div>
            <small>
              <sup>1</sup> Certifique-se de que você tenha o direito legal de uso da música para este fim.
              Não nos responsabilizamos pelos arquivos aqui enviados.
            </small>
          </div>
        </Typography>
      </CardContent>
    </Card>
  </>;
}