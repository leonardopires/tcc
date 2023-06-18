import {Outlet} from "react-router-dom";
import {Box, Container} from "@mui/material";
import {Footer} from "../molecules/Footer";

export function HomeLayout() {
  return (

    <div>
      <div className={"overlay"}>
        <div className={"overlay2"}>
        </div>
      </div>
      <main>
        <Box>
          <Container>
            <form>
              <Outlet/>
            </form>
            <Box style={{marginTop: "30%"}}>
              <Footer/>
            </Box>
          </Container>
        </Box>
      </main>
    </div>
  );
}