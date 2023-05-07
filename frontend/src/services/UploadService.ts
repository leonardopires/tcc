import axios from "axios";
import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";

export class UploadService {
  private baseURL: string = "http://localhost:8000";

  async upload(files: ExtendedFileProps[]) {

    if (files?.length > 0) {
      let promises: Promise<void>[] = [];

      for (let file of files) {
        let formData = new FormData();
        formData.append("file", file);
        promises.push(axios.post(`/upload`, formData,
        {
          baseURL: this.baseURL,
          headers: {"Content-Type": "multipart/form-data"},
        }));
      }
      await Promise.all(promises);
    }
  }
}