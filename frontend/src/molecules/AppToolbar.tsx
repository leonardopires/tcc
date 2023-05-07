import {AppBar, Toolbar} from "@mui/material";
import React from "react";
import {Logo} from "../atoms/Logo/Logo";
import {LogoText} from "../atoms/LogoText";

export function AppToolbar() {
  return <AppBar position="relative">
    <Toolbar>
      <Logo/>
      <LogoText/>
    </Toolbar>
  </AppBar>;
}