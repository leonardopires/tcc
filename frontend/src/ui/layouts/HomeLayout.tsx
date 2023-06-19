import {Footer} from "../molecules/Footer";
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";

export function HomeLayout() {
  return (
    <div className={"wrapper"}>
      <header>
      </header>
      <main>
        <div className={"overlay"}>
          <div className={"overlay2"}>
          </div>
        </div>
        <Container maxWidth={"md"}>
          <form>
            <Outlet/>
          </form>
        </Container>
      </main>
      <Footer/>
    </div>
  );
}