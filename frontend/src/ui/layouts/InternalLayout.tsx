import {AppToolbar} from "../organisms/AppToolbar/AppToolbar.tsx";
import {Outlet} from "react-router-dom";
import {Container} from "@mui/material";
import {Footer} from "../molecules/Footer";

export function InternalLayout() {
  return (
    <div className={"wrapper"}>
      <header>
        <AppToolbar/>
      </header>
      <main>
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