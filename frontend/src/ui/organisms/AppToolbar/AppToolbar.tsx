import {AppBar, Grid, IconButton, Toolbar} from "@mui/material";
import {Logo, LogoColor} from "../../atoms/Logo/Logo.tsx";
import {LogoText} from "../../atoms/LogoText.tsx";
import {RevoicerMenu} from "../../molecules/RevoicerMenu/RevoicerMenu.tsx";
import {IRevoicerUser} from "../../../models/IRevoicerUser.ts";
import {UserAvatar} from "../../atoms/UserAvatar/UserAvatar.tsx";
import {MenuRounded} from "@mui/icons-material";
import {useState} from "react";
import {NavLink} from "react-router-dom";

export function AppToolbar() {
  const [user] = useState<IRevoicerUser | undefined>(undefined);

  const open = false;

  return (
    <AppBar>
      <Toolbar>
        <Grid container columns={10}>
          <Grid item xs={1}>
            <IconButton
              edge={"start"}
              color={"inherit"}
              aria-label={"menu"}
              sx={{mr: 2, display: "none"}}
              aria-controls={open ? 'main-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <MenuRounded/>
            </IconButton>
          </Grid>
          <Grid item xs={8} textAlign={"center"} paddingY={"5px"}>
            <NavLink to={"/"}>
              <Logo color={LogoColor.Light}/>
              <LogoText/>
            </NavLink>
          </Grid>
          <Grid item xs={1}>
            <RevoicerMenu
              id={"accountMenu"}
              icon={<UserAvatar user={user}/>}
              actions={[]}
              style={{display:"none"}}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}