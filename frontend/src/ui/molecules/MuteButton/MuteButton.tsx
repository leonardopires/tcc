import {IconButton} from "@mui/material";
import {Mic, MicOff, VolumeMute, VolumeOff, VolumeUp} from "@mui/icons-material";
import React from "react";

export function MuteButton(props: { onClick: () => void, muted: boolean }) {
  let mutedStyle = {
    border: "3px solid #9A7217",
    borderRadius: "5px",
    padding: "0 5px",
    height: "40px",
    width: "40px",
    color: "black",
  };
  let unmutedStyle = {
    background: "linear-gradient(180deg, #07A303 0%, #0B7109 100%)",
    borderRadius: "5px",
    padding: "0 5px",
    height: "40px",
    width: "40px",
    color: "white",
  };

  return <IconButton
    onClick={props.onClick}
    color={props.muted ? "error" : "success"}
    style={props.muted ? mutedStyle : unmutedStyle}
  >
    {props.muted ? <VolumeOff/> : <VolumeUp/>}
  </IconButton>;
}