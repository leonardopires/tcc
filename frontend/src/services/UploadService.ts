import axios from "axios";
import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";

export class UploadService {
  private baseURL: string = "https://localhost:32770/api";

  async upload(files: ExtendedFileProps[]) {

    if (files?.length > 0) {
      let promises: Promise<void>[] = [];

      for (let file of files) {
        let formData = new FormData();
        formData.append(file.name, file);
        promises.push(axios.post(`/FileManager/upload`, formData,
        {
          baseURL: this.baseURL,
          headers: {"Content-Type": "multipart/form-data"},
        }));
      }
      await Promise.all(promises);
    }
  }
}