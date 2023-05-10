import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";
import {IFileDescriptor, setSongFiles, uploadSongsSlice} from "./uploadSongsSlice";
import {AppThunk} from "../../app/store";
import {UploadService} from "../../services/UploadService";

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
    let uploadService = new UploadService();
    let serializableFiles: IFileDescriptor[] = files.map(createFileDescriptor);
    dispatch(setSongFiles(serializableFiles))
    let filesAfterUpload = await uploadService.upload(files);
    dispatch(setSongFiles(filesAfterUpload))
  }
}
