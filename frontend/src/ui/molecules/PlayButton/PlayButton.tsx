import React from "react";
import {Button, CircularProgress} from "@mui/material";
import {PlayIcon} from "../../atoms/PlayIcon/PlayIcon";
import {PlayerState} from "../../../features/player/playerSlice";
import {PauseIcon} from "../../atoms/PauseIcon/PauseIcon";

export function PlayButton({state, onClick, disabled}: {
  state: PlayerState,
  onClick: () => void,
  disabled?: boolean
}): React.ReactElement {
  return (
    <Button
      variant={"contained"}
      onClick={onClick}
      disabled={disabled}
      style={{
        marginTop: "-2em",
        borderRadius: "100%",
        width: "5em",
        height: "5em",
        backgroundColor: "#FFED9D",
        alignItems: "center",
      }}
    >
      {disabled ? (
        <CircularProgress variant={"indeterminate"} value={100} />
      ) : (
        state === PlayerState.Playing
        ? <PauseIcon/>
        : <PlayIcon />
        )}
    </Button>
  );
}