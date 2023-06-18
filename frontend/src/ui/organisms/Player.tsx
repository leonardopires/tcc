import {PlayerService} from "../../services/PlayerService";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {IID3Tag} from "id3-parser/lib/interface";
import ReactAudioPlayer from "react-audio-player";
import {Box, Grid, Paper, Typography} from "@mui/material";
import {PlayButton} from "../molecules/PlayButton/PlayButton";
import {togglePlayingState} from "../../features/player/togglePlayingState";
import {CSSProperties, useState} from "react";
import {PlayingTime} from "../atoms/PlayingTime/PlayingTime";
import {PlayingProgress} from "../atoms/PlayingProgress/PlayingProgress";
import {setPlayerTrack} from "../../features/player/playerSlice";
import {RevoicerStatus} from "../../features/revoicer/revoicerStatus";

const {REVOICER_BASE_URL} = import.meta.env;

const playerService = PlayerService.instance();

/**
 * Represents the player size options.
 * @enum {number}
 */
export enum PlayerSize {
  Medium,
  XLarge,
};

/**
 * Renders the audio player component.
 * @param {object} props - The component props.
 * @param {string} props.id - The ID of the player.
 * @param {boolean} [props.muted=false] - Determines if the player is muted.
 * @param {PlayerSize} props.size - The size of the player.
 * @param {CSSProperties} [props.style] - The custom style for the player.
 * @returns {JSX.Element} The rendered component.
 */
export function Player({id, muted = false, size = PlayerSize.XLarge, style}: {
  id: string,
  muted?: boolean,
  size: PlayerSize,
  style?: CSSProperties
}) {
  const dispatch = useAppDispatch();
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const jobs = useAppSelector(state => state.revoicer.uploadedFiles);
  let songInfo: Partial<IID3Tag | undefined> = useAppSelector(state => state.revoicer.songInfo);
  const artwork = useAppSelector(state => state.revoicer.artwork);

  const state = useAppSelector(state => state.player.state);
  const status = useAppSelector(state => state.revoicer.status);

  let job = jobs[0];
  let src = job?.filePath;

  if (!src?.startsWith("data:audio/mpeg;base64")) {
    src = `${REVOICER_BASE_URL}/api/FileManager/redirect?filePath=%2F${encodeURIComponent(src)}`;
  }

  if (!songInfo) {
    songInfo = ({artist: "Artista Desconhecido", title: job?.name});
  }

  /**
   * Handles the time update event of the player.
   * @param {number} updatedTime - The updated time of the player.
   * @param {boolean} [shouldSeek=false] - Determines if the player should seek to the updated time.
   */
  function onTimeUpdate(updatedTime: number, shouldSeek: boolean = false) {
    setTime(updatedTime);

    if (shouldSeek) {
      playerService.setTime(updatedTime);
    }
  }

  /**
   * Registers the player in the player service.
   * @param {ReactAudioPlayer | null} me - The reference to the audio player component.
   */
  function registerPlayer(me?: ReactAudioPlayer | null) {
    if (me?.props?.id && me?.audioEl?.current) {
      let player = me.audioEl.current;
      let id = me.props.id;

      setDuration(player.duration);

      let existingPlayer = playerService.getPlayer(id);

      if (!existingPlayer || existingPlayer !== player || existingPlayer.src !== player.src) {
        dispatch(setPlayerTrack({id, src: player.src, volume: 1}));

        player.ontimeupdate = () => {
          if (Math.abs(time - player.currentTime) > 1) {
            onTimeUpdate(player.currentTime);
          }
        };

        playerService.registerPlayer(id, player);
      }
    }
  }


  return <Box
    justifyContent={"center"}
    alignItems={"center"}
    textAlign={"center"}
    style={style}
  >
    <Paper
      variant={"elevation"}
      style={{
        border: "transparent",
        borderRadius: "5em",
        height: size === PlayerSize.XLarge ? "12em" : "5em",
        backgroundImage: `url(${artwork})`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
      }}>
    </Paper>
    <PlayButton
      state={state}
      disabled={status >= RevoicerStatus.Uploading && status < RevoicerStatus.Uploaded}
      onClick={() => dispatch(togglePlayingState())}
    />
    <Typography variant={"h4"}>{songInfo.title}</Typography>
    <Typography variant={"h5"}>{songInfo.artist}</Typography>
    <ReactAudioPlayer
      id={id}
      src={src}
      controls={false}
      muted={muted}
      onEnded={() => {
        dispatch(togglePlayingState());
        onTimeUpdate(0, true);
      }}
      ref={me => registerPlayer(me)}
    />
    <Grid container columns={10}>
      <Grid item xs={2}>

      </Grid>
      <Grid item xs={1}>
        <PlayingTime time={time}/>
      </Grid>
      <Grid item xs={4}>
        <PlayingProgress
          elapsed={time}
          duration={duration}
          onSeek={newTime => onTimeUpdate(newTime, true)}
        />
      </Grid>
      <Grid item xs={1}>
        <PlayingTime time={duration}/>
      </Grid>
      <Grid item xs={2}>

      </Grid>
    </Grid>
  </Box>;
}
