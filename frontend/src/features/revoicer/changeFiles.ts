import {setSongFiles, setStatus} from "./revoicerSlice";
import {AppThunk} from "../../ui/app/store";
import {UploadService} from "../../services/UploadService";
import {IRevoiceJob} from "./IRevoiceJob";
import {RevoicerStatus} from "./revoicerStatus";
// @ts-ignore
import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";

let filesToUpload: ExtendedFileProps[] = [];

export function changeFiles(files: ExtendedFileProps[]): AppThunk<Promise<void>> {
  return async (dispatch) => {
    let uploadService = new UploadService();
    let serializableFiles: IRevoiceJob[] = files.map(uploadService.createFileDescriptor);

    filesToUpload = files;

    if (files.length) {
      dispatch(setStatus(RevoicerStatus.Uploading));
      dispatch(setSongFiles(serializableFiles));
      dispatch(setStatus(RevoicerStatus.FilesSelected));
    } else {
      dispatch(setStatus(RevoicerStatus.Empty));
      dispatch(setSongFiles([]));
    }
  };
}

export function uploadFiles(): AppThunk<Promise<void>> {
  return async (dispatch, getState) => {
    let state = getState();
    let uploadService = new UploadService();
    let files = state.revoicer.uploadedFiles;

    if (files.length) {
      dispatch(setStatus(RevoicerStatus.Uploading));
      let result = await uploadService.upload(filesToUpload);
      dispatch(setStatus(RevoicerStatus.Uploaded));
      dispatch(setSongFiles(result));
    } else {
      dispatch(setStatus(RevoicerStatus.Empty));
      dispatch(setSongFiles([]));
    }
  };
}
