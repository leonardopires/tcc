import {FileService} from "../../../services/FileService";
import React, {CSSProperties, useState} from "react";
import ReactAudioPlayer from "react-audio-player";
import {Box, Grid, IconButton, Paper, Typography} from "@mui/material";
import {TrackStatus} from "../../atoms/TrackStatus/TrackStatus";
import {AppConfig} from "../../../AppConfig";
import {Download, Share} from "@mui/icons-material";
import {PlayerService} from "../../../services/PlayerService";
import {useAppSelector} from "../../../app/hooks";
import {MuteButton} from "../MuteButton/MuteButton";
import {getTrackInfo} from "./GetTrackInfo";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {ITrack} from "../../../features/revoicer/ITrack";

const playerService = PlayerService.instance();

export function Track({track}: { track: ITrack }) {
  let id = track.id;
  let [muted, setMuted] = useState(playerService.getPlayer(id)?.muted);

  let voices = useAppSelector(state => state.revoicer.voices);

  let itemStyle: CSSProperties = {};

  let nonButtonItemStyle: CSSProperties = {
    paddingTop: "12px",
  };


  function registerPlayer(me?: ReactAudioPlayer | null) {
    if (me?.props?.id && me?.audioEl?.current) {
      let player = me.audioEl.current;
      let id = me.props.id;

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
          <FontAwesomeIcon icon={track.icon} />
        </Grid>
        <Grid item xs={13} style={{...itemStyle, ...nonButtonItemStyle}}>
          <Typography variant={"h6"}>{track.name}</Typography>

          <ReactAudioPlayer
            id={track.id}
            src={`${AppConfig.api.baseURL}FileManager/redirect?filePath=%2F${encodeURIComponent(track.filePath)}`}
            controls={false}
            muted={muted}
            ref={registerPlayer}
          />
        </Grid>
        <Grid item xs={3} style={itemStyle}>
          <IconButton style={{visibility: "hidden"}}>
            <Share/>
          </IconButton>
          <IconButton  style={{visibility: "hidden"}}>
            <Download/>
          </IconButton>
        </Grid>
        <Grid item xs={1} style={itemStyle}>
          <Box>
            <MuteButton onClick={() => setMuted(!muted)} muted={!!muted}/>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}