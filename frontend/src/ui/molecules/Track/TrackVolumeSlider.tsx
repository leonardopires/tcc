import {ITrack} from "../../../features/revoicer/ITrack";
import {useState} from "react";
import {Slider} from "@mui/material";
import {PlayerService} from "../../../services/PlayerService";

const playerService = PlayerService.instance();
export function TrackVolumeSlider(props: {
  track: ITrack,
}) {
  let [volume, setVolume] = useState(0.7);

  function onChange(_: Event, volume: number | number[]) {
    let value = ((volume as number) ?? 100) / 100;

    let player = playerService.getPlayer(props.track.id);
    if (player) {
      player.volume = value;
    }
    setVolume(value);
  }

  return (
    <Slider
      value={volume * 100}
      onChange={onChange}
      max={100}
      step={1}
      size={"small"}
      style={{
        color: "#58470a"
      }}
    >
    </Slider>
  );
}