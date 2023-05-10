import axios from "axios";
import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";
import {AppConfig} from "../AppConfig";
import {IFileDescriptor} from "../features/uploadSong/uploadSongsSlice";

export class UploadService {
  private baseURL: string = AppConfig.api.baseURL;

  async upload(files: ExtendedFileProps[]) {
    let filesUploaded: IFileDescriptor[] = [];
    if (files?.length > 0) {
      let tasks: (() => Promise<IFileDescriptor[]>)[] = [];

      for (let file of files) {
        let formData = new FormData();
        formData.append(file.name, file);
        let task = async (): Promise<IFileDescriptor[]> => {
          const result = await axios.post(`FileManager/upload`, formData,
            {
              baseURL: this.baseURL,
              headers: {"Content-Type": "multipart/form-data"},
            })
          return result?.data?.map((item: any) => item as IFileDescriptor) ?? [];
        }

        tasks.push(task);
      }
      filesUploaded = (await Promise.all(tasks.map(task => task()))).flat();
    }
    return filesUploaded;
  }
}