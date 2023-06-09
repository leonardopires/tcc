import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";
import {IRevoiceJob, RevoicerStatus, setArtwork, setSongInfo} from "../features/revoicer/revoicerSlice";
import React from "react";
import {Box, Button, Typography} from "@mui/material";
import {FileSelector} from "../molecules/FileSelector/FileSelector";
import {ButtonsConfig} from "../app/ButtonsConfig";
import {LoadingButton} from "@mui/lab";
import {SongList} from "../molecules/SongList";
import {convertFileToBuffer} from 'id3-parser/lib/universal/helpers';
import universalParse from 'id3-parser/lib/universal';
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {Buffer} from "buffer/";
import {LastFMService} from "../services/LastFMService";
import {UrlService} from "../services/UrlService";
import ReactAudioPlayer from "react-audio-player";


export function UploadStep(props: {
  onFilesSelected: (files: ExtendedFileProps[]) => void,
  jobs: IRevoiceJob[],
  status: RevoicerStatus,
  onUploadClick: React.MouseEventHandler<HTMLButtonElement>
  files: IRevoiceJob[]
}) {
  let {files, jobs, onUploadClick, status, onFilesSelected} = props;
  const dispatch = useAppDispatch();
  const songInfo = useAppSelector(state => state.revoicer.songInfo);
  const artwork = useAppSelector(state => state.revoicer.artwork);

  async function handleFilesSelected(files: ExtendedFileProps[]) {
    let file = files[0];
    let lastFM = LastFMService.instance();
    let urlService = UrlService.instance();

    if (file) {
      let buffer = await convertFileToBuffer(file as any as File);
      let songInfo = await universalParse(buffer);

      file.path = urlService.getBase64URL(buffer, "audio/mpeg");

      let image = null;

      console.log(songInfo);

      if (songInfo?.image?.data) {
        let imageData = songInfo?.image?.data;
        console.log("Image found in id3. Using it.");
        let contentType = "image/*";
        let base64Url = urlService.getBase64URL(imageData, contentType);
        image = {
          ["#text"]: base64Url
        };
        songInfo.image.data = [];
      } else {
        console.log("Image NOT found in id3. Trying to get from Last.fm.");
        let results = await lastFM.getAlbumInfo({
          artist: songInfo?.artist,
          album: songInfo?.album,
        });

        image = results?.album?.image?.pop();
      }

      if (image) {
        let imageUrl = image["#text"];
        console.log(imageUrl);
        dispatch(setArtwork(imageUrl));
      }
      dispatch(setSongInfo(songInfo));
    }

    onFilesSelected(files);
  }

  return <Box>
    <Typography variant={"h1"}>Upload</Typography>
    <FileSelector
      id={"song"}
      onChange={handleFilesSelected}
      canAdd={jobs.length === 0}
      files={jobs.map(item => item as any as ExtendedFileProps)}
    />
    {(jobs.length > 0 && songInfo) ? (
      <Box
        justifyContent={"center"}
        alignItems={"center"}
        textAlign={"center"}
      >
        <Box style={{
          border: "transparent",
          borderRadius: "5em",
          height: "12em",
          backgroundImage: `url(${artwork})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        </Box>
        <Typography variant={"h5"}>{songInfo.title}</Typography>
        <Typography>{songInfo.artist}</Typography>
        <ReactAudioPlayer src={jobs[0].filePath} controls={true}/>
        <Box>
          <LoadingButton
            variant={"contained"}
            color={"primary"}
            disabled={ButtonsConfig.uploadButtonDisabledWhen.includes(status)}
            onClick={onUploadClick}
            loading={status === RevoicerStatus.Uploading}
          >Upload</LoadingButton>
        </Box>

      </Box>
    ) : ""}
    <SongList
      files={files}
      type={"input"}
    />
  </Box>;
}