import {AppToolbar} from "../molecules/AppToolbar/AppToolbar.tsx";
import {Outlet} from "react-router-dom";
import {Box, Container} from "@mui/material";
import {Footer} from "../molecules/Footer";

export function InternalLayout() {
  return (
    <div className={"wrapper"}>
      <header className={"page-header"}>
        <AppToolbar/>
      </header>
      <main className={"page-body"}>
        <Box>
          <Container>
            <form>
              <Outlet/>
            </form>
          </Container>
        </Box>
      </main>
      <footer className={"page-footer"}>
        <Footer/>
      </footer>
    </div>
  );
}