import {Typography} from "@mui/material";
import React from "react";

export function PlayingTime(props: { time: number }) {
  let {time} = props;
  if (!time || Number.isNaN(time) || time < 0) {
    time = 0;
  }
  return (
    <Typography
      fontSize={"small"}
      marginTop={"-2px"}
    >{Math.floor(time / 60).toString().padStart(2, "0")}:{(Math.floor(time) % 60).toString().padStart(2, "0")}</Typography>
  );
}