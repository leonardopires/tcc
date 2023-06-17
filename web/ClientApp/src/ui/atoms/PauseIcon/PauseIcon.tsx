import React from "react";
import {Pause} from "@mui/icons-material";

export function PauseIcon({size = "48px"}: {size?: string}) {
  return <Pause
    style={{
      color: "#1E1E1E",
      width: size,
      height: size,
    }}
  />;
}