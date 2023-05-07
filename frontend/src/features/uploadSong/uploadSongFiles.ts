import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";
import {IFileDescriptor, setSongFiles, uploadSongsSlice} from "./uploadSongsSlice";
import {AppThunk} from "../../app/store";

function createFileDescriptor(file: ExtendedFileProps): IFileDescriptor {
  return {
    name: file.name,
    extension: file.extension,
    path: file.path,
    size: file.size,
    type: file.type,
  };
}

export function uploadSongFiles(files: ExtendedFileProps[]): AppThunk<Promise<void>> {
  return async (dispatch) => {

    let serializableFiles: IFileDescriptor[] = files.map(createFileDescriptor);
    dispatch(setSongFiles(serializableFiles))
  }
}
