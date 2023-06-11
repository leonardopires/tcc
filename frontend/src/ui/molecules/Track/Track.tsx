import {FileService} from "../../../services/FileService";
import React, {CSSProperties, useState} from "react";
import ReactAudioPlayer from "react-audio-player";
import {Box, Grid, IconButton, Paper, Typography} from "@mui/material";
import {TrackStatus} from "../../atoms/TrackStatus/TrackStatus";
import {AppConfig} from "../../../AppConfig";
import {Download, Share} from "@mui/icons-material";
import {PlayerService} from "../../../services/PlayerService";
import {useAppSelector} from "../../../app/hooks";
import {IVoice} from "../../../features/revoicer/revoicerSlice";
import {MuteButton} from "../MuteButton/MuteButton";

const playerService = PlayerService.instance();

function getTrackInfo(childFile: string, voices: IVoice[]) {
  let fileName = FileService.formatName(childFile);
  let id = fileName.replace(/\.mp3$/, "");
  let name;

  switch (id) {
    case "no_vocals":
      name = "Instrumental";
      break;

    case "vocals":
      name = "Vocal Original";
      break;

    default:
      name = voices.find(voice => voice.id === id)?.name ?? id;
      break;
  }
  return {name, id};
}

export function Track({file, type}: { file: string, type: string }) {
  let id = FileService.formatName(file);
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

  let trackInfo = getTrackInfo(file, voices);

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
      <Grid container key={`${type}_${file}`} columns={20}>
        <Grid item xs={1} style={{...itemStyle, ...nonButtonItemStyle}}>
          <TrackStatus status={!muted}/>
        </Grid>
        <Grid item xs={14} style={{...itemStyle, ...nonButtonItemStyle}}>
          <Typography variant={"h6"}>{trackInfo.name}</Typography>

          <ReactAudioPlayer
            id={trackInfo.id}
            src={`${AppConfig.api.baseURL}FileManager/redirect?filePath=%2F${encodeURIComponent(file)}`}
            controls={false}
            muted={muted}
            ref={registerPlayer}
          />
        </Grid>
        <Grid item xs={3} style={itemStyle}>
          <IconButton>
            <Share/>
          </IconButton>
          <IconButton>
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