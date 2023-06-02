import axios from "axios";
import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";
import {AppConfig} from "../AppConfig";
import {IRevoiceJob} from "../features/revoicer/revoicerSlice";

export class UploadService {
  private baseURL: string = AppConfig.api.baseURL;

  async upload(files: ExtendedFileProps[]) {
    let filesUploaded: IRevoiceJob[] = [];
    if (files?.length > 0) {
      let tasks: (() => Promise<IRevoiceJob[]>)[] = [];

      for (let file of files) {
        let formData = new FormData();
        formData.append(file.name, file);
        let task = async (): Promise<IRevoiceJob[]> => {
          const response = await axios.post(`FileManager/upload`, formData,
            {
              baseURL: this.baseURL,
              headers: {"Content-Type": "multipart/form-data"},
            });

          return response?.data?.map((item: any) => item as IRevoiceJob) ?? [];
        };

        tasks.push(task);
      }
      filesUploaded = (await Promise.all(tasks.map(task => task()))).flat();
    }
    return filesUploaded;
  }

  createFileDescriptor(file: ExtendedFileProps): IRevoiceJob {
    return {
      name: file.name,
      extension: file.extension,
      voice: "NoelGallagher",
      filePath: file.path,
      size: file.size,
      type: file.type,
      input: [],
      split: [],
      revoiced: [],
    }
  }
}