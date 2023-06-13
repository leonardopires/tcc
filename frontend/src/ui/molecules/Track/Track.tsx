import React, {CSSProperties, ReactEventHandler, SyntheticEvent, useState} from "react";
import ReactAudioPlayer from "react-audio-player";
import {Box, Grid, IconButton, Paper, Slider, Typography} from "@mui/material";
import {TrackStatus} from "../../atoms/TrackStatus/TrackStatus";
import {AppConfig} from "../../../AppConfig";
import {Download} from "@mui/icons-material";
import {PlayerService} from "../../../services/PlayerService";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {MuteButton} from "../MuteButton/MuteButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ITrack} from "../../../features/revoicer/ITrack";
import {setTrackVolume} from "../../../features/player/setTrackVolume";
import {PlayerState, setPlayerTrack, setPlayerTrackVolume} from "../../../features/player/playerSlice";
import {setPlayingState} from "../../../features/player/setPlayingState";

const playerService = PlayerService.instance();

function TrackVolumeSlider(props: {
  track: ITrack,
}) {
  let [volume, setVolume] = useState(0.7);

  function onChange(e: Event, volume: number | number[]) {
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

export function Track({track}: { track: ITrack }) {
  let id = track.id;
  let [muted, setMuted] = useState(playerService.getPlayer(id)?.muted);

  let voices = useAppSelector(state => state.revoicer.voices);
  let songInfo = useAppSelector(state => state.revoicer.songInfo);

  let trackState = useAppSelector(state => state.player.tracks?.find(track => track.id === id));

  let itemStyle: CSSProperties = {};

  let nonButtonItemStyle: CSSProperties = {
    paddingTop: "12px",
  };

  let dispatch = useAppDispatch();

  function registerPlayer(me?: ReactAudioPlayer | null) {
    if (me?.props?.id && me?.audioEl?.current) {
      let player = me.audioEl.current;
      let id = me.props.id;
      player.volume = 0.7;

      dispatch(setPlayerTrack({id, src: player.src, volume: player.volume}));
      playerService.registerPlayer(id, player);
    }
  }

  return (
    <Paper
      variant={"outlined"}
      style={{
        marginTop: "5px",
        padding: "10px 10px",
        verticalAlign: "middle",
        background: "rgba(31, 24, 8, 0.07)",
        border: "1px solid #AB852D",
        borderRadius: "0.7em",
      }}>
      <Grid container columns={20}>
        <Grid item xs={1} style={{...itemStyle, ...nonButtonItemStyle}}>
          <TrackStatus status={!muted}/>
        </Grid>
        <Grid item xs={1} style={{...itemStyle, ...nonButtonItemStyle}}>
          <FontAwesomeIcon icon={track.icon}/>
        </Grid>
        <Grid item xs={10} sm={12} md={14} style={{...itemStyle, ...nonButtonItemStyle}}>
          <Typography
            variant={"h6"}
            overflow={"clip"}
            textOverflow={"ellipsis"}
            width={"100%"}
            position={"relative"}
          >{track.name === "Original" && songInfo?.artist ? `Original: ${songInfo.artist}` : track.name}</Typography>

          <ReactAudioPlayer
            id={track.id}
            src={`${AppConfig.api.baseURL}FileManager/redirect?filePath=%2F${encodeURIComponent(track.filePath)}`}
            controls={false}
            muted={muted}
            ref={registerPlayer}
            onEnded={() => {
              dispatch(setPlayingState(PlayerState.Paused));
              playerService.setTime(0);
            }}
          />
        </Grid>
        <Grid item xs={3} sm={2} style={{...itemStyle, paddingTop: "5px"}}>
          <TrackVolumeSlider
            track={track}
          />
        </Grid>
        <Grid item
              xs={2}
              sm={2}
              md={1}
              style={{...itemStyle, paddingLeft: "10px"}}
        >
          <IconButton
            href={`${AppConfig.api.baseURL}FileManager/redirect?filePath=%2F${encodeURIComponent(track.filePath)}`}
            target={"_blank"}>
            <Download/>
          </IconButton>
        </Grid>
        <Grid item
              xs={1}
              style={itemStyle}
              textAlign={"end"}
        >
          <MuteButton onClick={() => setMuted(!muted)} muted={!!muted}/>
        </Grid>
      </Grid>
    </Paper>
  );
}