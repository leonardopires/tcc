import playingProgress from "./playingProgress.svg";
import {CSSProperties} from "react";
import {Box} from "@mui/material";

export function PlayingProgress({elapsed, duration, onSeek}: { elapsed: number, duration: number, onSeek: (time: number) => void }) {
  let percentage = elapsed / duration * 100;
  let width = `${percentage}%`;

  const commonStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    minHeight: "12px",
    backgroundImage: `url(${playingProgress})`,
    backgroundClip: "border-box",
    backgroundSize: "240px",
    backgroundRepeat: "repeat-x",
    fontSize: "1px",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        position: "relative"
      }}
      onMouseUp={(e) => {
        let clientRect = e.currentTarget.getClientRects()[0];
        let left = clientRect.x;
        let mousePosition = e.clientX;
        let newPos = mousePosition - left;
        let newTime = (newPos / clientRect.width) * duration;
        onSeek(newTime);
      }}
    >
      <Box
        className={"rev-PlayingProgress-total"}
        style={{
          ...commonStyle,
          minWidth: "100%",
          opacity: "20%",
        }}
      >
        &nbsp;
      </Box>
      <Box
        className={"rev-PlayingProgress-elapsed"}
        style={{
          ...commonStyle,
          minWidth: width,
          maxWidth: width,
          width: width,
        }}
      >
        &nbsp;
      </Box>
    </div>
  );
}