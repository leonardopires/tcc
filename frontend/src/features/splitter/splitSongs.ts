import {AppThunk} from "../../app/store";
import {IFileDescriptor, setSongFiles} from "../uploadSong/uploadSongsSlice";
import {SplitterService} from "../../services/SplitterService";

export function splitSongs(files: IFileDescriptor[]): AppThunk<Promise<void>> {

  return async (dispatch) => {
    if (files.length > 0) {
      let splitterService = new SplitterService();
      let splitFiles = await splitterService.split(files[0]);
      dispatch(setSongFiles(splitFiles));
    }
  }
}
