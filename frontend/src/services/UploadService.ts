import axios from "axios";
// @ts-ignore
import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";

import {IRevoiceJob} from "../features/revoicer/IRevoiceJob";

const {REVOICER_BASE_URL} = import.meta.env;

export class UploadService {
  private baseURL: string = REVOICER_BASE_URL;

  async upload(files: ExtendedFileProps[]) {
    let filesUploaded: IRevoiceJob[] = [];
    if (files?.length > 0) {
      let tasks: (() => Promise<IRevoiceJob[]>)[] = [];

      for (let file of files) {
        let formData = new FormData();
        formData.append(file.name, file);
        let task = async (): Promise<IRevoiceJob[]> => {
          const response = await axios.post(`/api/FileManager/upload`, formData,
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