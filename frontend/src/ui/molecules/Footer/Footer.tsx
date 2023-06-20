import {Disclaimer} from "./Disclaimer.tsx";
import {Container} from "@mui/material";

export function Footer() {
  return (
    <footer>
      <Container maxWidth={"md"} style={{padding: "0 50px 20px 50px"}}>
        <Disclaimer>
          Revoicer é um trabalho de conclusão do curso de Sistemas de
          Informação
          da <a href={"https://www.feevale.br/"} target={"_blank"}>Universidade Feevale</a>.
        </Disclaimer>
        <Disclaimer>
          &copy; 2023 - <a href={"http://ludikore.com"} target={"_blank"}>Leonardo Petersen Thomé Pires</a>.
        </Disclaimer>
        <Disclaimer italic> Os arquivos e músicas enviados para este
          site
          são de inteira responsabilidade de quem fez o envio.
          Use apenas músicas que você tenha adquirido legalmente e/ou detenha os direitos autorais e ou
          de cópia.
        </Disclaimer>
        <Disclaimer italic>
          Este site foi desenvolvido com fins acadêmicos para estudar a aplicação de inteligência artificial no campo da
          música. O código fonte encontra-se no <a href={"https://github.com/leonardopires/tcc"} target={"_blank"}>GitHub</a>
        </Disclaimer>
      </Container>
    </footer>
  );
}