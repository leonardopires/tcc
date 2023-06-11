import React from "react";
import {Button} from "@mui/material";
import {PlayIcon} from "../../atoms/PlayIcon/PlayIcon";
import {PlayerState} from "../../../features/player/playerSlice";
import { PauseIcon } from "../../atoms/PauseIcon/PauseIcon";

export function PlayButton({state, onClick}: { state: PlayerState, onClick: () => void }): React.ReactElement {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      style={{
        marginTop: "-2em",
        borderRadius: "100%",
        width: "5em",
        height: "5em",
        backgroundColor: "#FFED9D",
        alignItems: "center",
      }}
    >
      {state === PlayerState.Playing ? <PauseIcon/> : <PlayIcon />}
    </Button>
  );
}