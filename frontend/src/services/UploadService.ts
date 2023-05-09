import axios from "axios";
import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";
import {AppConfig} from "../AppConfig";

export class UploadService {
  private baseURL: string = AppConfig.api.baseURL;

  async upload(files: ExtendedFileProps[]) {

    if (files?.length > 0) {
      let promises: Promise<void>[] = [];

      for (let file of files) {
        let formData = new FormData();
        formData.append(file.name, file);
        promises.push(axios.post(`FileManager/upload`, formData,
        {
          baseURL: this.baseURL,
          headers: {"Content-Type": "multipart/form-data"},
        }));
      }
      await Promise.all(promises);
    }
  }
}