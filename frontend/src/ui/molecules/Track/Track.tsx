import {CSSProperties, useState} from "react";
import ReactAudioPlayer from "react-audio-player";
import {Grid, IconButton, Paper, Typography} from "@mui/material";
import {TrackStatus} from "../../atoms/TrackStatus/TrackStatus";
import {Download} from "@mui/icons-material";
import {PlayerService} from "../../../services/PlayerService";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {MuteButton} from "../MuteButton/MuteButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ITrack} from "../../../features/revoicer/ITrack";
import {PlayerState, setPlayerTrack} from "../../../features/player/playerSlice";
import {setPlayingState} from "../../../features/player/setPlayingState";
import {TrackVolumeSlider} from "./TrackVolumeSlider";
import {revoicerTheme} from "../../theme/revoicerTheme.ts";

const {REVOICER_BASE_URL} = import.meta.env;
const playerService = PlayerService.instance();

export function Track({track}: { track: ITrack }) {
  let id = track.id;
  let [muted, setMuted] = useState(playerService.getPlayer(id)?.muted);

  let songInfo = useAppSelector(state => state.revoicer.songInfo);

  let itemStyle: CSSProperties = {};

  let nonButtonItemStyle: CSSProperties = {
    display: "block",
    minHeight: "100%",
    verticalAlign: "bottom"
  };

  let dispatch = useAppDispatch();

  function registerPlayer(me?: ReactAudioPlayer | null) {
    if (me?.props?.id && me?.audioEl?.current) {
      let player = me.audioEl.current;
      let id = me.props.id;
      player.volume = 0.7;

      let existingPlayer = playerService.getPlayer(id);

      if (!existingPlayer || existingPlayer !== player || existingPlayer.src !== player.src) {

        dispatch(setPlayerTrack({id, src: player.src, volume: player.volume}));
        playerService.registerPlayer(id, player);
      }
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
      <Grid container columns={20} columnSpacing={"5px"} rowSpacing={"10px"}>
        <Grid item
              xs={4}
              sm={3}
              style={{...itemStyle, ...nonButtonItemStyle}}
              paddingY={"10px"}
        >
          <IconButton size={"small"}><TrackStatus status={!muted}/></IconButton>
          <IconButton size={"small"}><FontAwesomeIcon icon={track.icon}/></IconButton>
        </Grid>
        <Grid item xs={16} sm={10} style={{...itemStyle, ...nonButtonItemStyle}}>
          <Typography
            variant={"h6"}
            overflow={"clip"}
            textOverflow={"ellipsis"}
            width={"100%"}
            paddingY={"10px"}
          >{track.name === "Original" && songInfo?.artist ? `Original: ${songInfo.artist}` : track.name}</Typography>

          <ReactAudioPlayer
            id={track.id}
            src={`${REVOICER_BASE_URL}/api/FileManager/redirect?filePath=%2F${encodeURIComponent(track.filePath)}`}
            controls={false}
            muted={muted}
            ref={registerPlayer}
            onEnded={() => {
              dispatch(setPlayingState(PlayerState.Paused));
              playerService.setTime(0);
            }}
          />
        </Grid>
        <Grid item xs={11} sm={3} style={{...itemStyle}}>
          <TrackVolumeSlider
            track={track}
          />
        </Grid>
        <Grid item
              xs={5}
              sm={2}
              style={{...itemStyle}}
              textAlign={"right"}
        >
          <IconButton
            href={`${REVOICER_BASE_URL}/api/FileManager/redirect?filePath=%2F${encodeURIComponent(track.filePath)}`}
            target={"_blank"}
            style={revoicerTheme().custom.mutedStyle}
          >
            <Download/>
          </IconButton>
        </Grid>
        <Grid item
              xs={2}
              style={itemStyle}
              textAlign={"left"}
        >
          <MuteButton onClick={() => setMuted(!muted)} muted={!!muted}/>
        </Grid>
      </Grid>
    </Paper>
  );
}