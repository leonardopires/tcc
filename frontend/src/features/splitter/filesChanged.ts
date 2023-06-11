import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";
import {LastFMService} from "../../services/LastFMService";
import {UrlService} from "../../services/UrlService";
import {convertFileToBuffer} from "id3-parser/lib/universal/helpers";
import universalParse from "id3-parser/lib/universal";
import {setArtwork, setSongInfo} from "../revoicer/revoicerSlice";
import {changeFiles} from "../revoicer/changeFiles";
import {AppThunk} from "../../app/store";

export function filesChanged(files: ExtendedFileProps[]): AppThunk<Promise<void>> {
  return async (dispatch) => {
    let file = files[0];
    let lastFM = LastFMService.instance();
    let urlService = UrlService.instance();

    if (file) {
      let buffer = await convertFileToBuffer(file as any as File);
      let songInfo;

      try {
        songInfo = await universalParse(buffer);
      } catch (e) {
        songInfo = {title: file.name, artist: "Artista Desconhecido"};
      }

      file.path = urlService.getBase64URL(buffer, "audio/mpeg");

      let image = null;

      console.log(songInfo);

      if (songInfo?.image?.data) {
        let imageData = songInfo?.image?.data;
        console.log("Image found in id3. Using it.");
        let contentType = "image/*";
        let base64Url = urlService.getBase64URL(imageData, contentType);
        image = base64Url;
        songInfo.image.data = [];
      } else {
        console.log("Image NOT found in id3. Trying to get from Last.fm.");
        let artist = songInfo?.artist ?? songInfo?.band;
        let album = songInfo?.album;

        let results;
        if (album && artist) {
          results = await lastFM.getAlbumInfo({
            artist,
            album,
          });
          console.log("LastFM results (album): ", results);
        }

        image = lastFM.findImage(results);

        if (!image && artist) {
          results = await lastFM.getArtistInfo(artist);
          console.log("LastFM results (artist): ", results);
          image = lastFM.findImage(results);
        }

      }

      console.log("image", image);

      if (image) {
        console.log(image);
        dispatch(setArtwork(image));
      }
      dispatch(setSongInfo(songInfo));
    }

    dispatch(changeFiles(files));
  };
}
