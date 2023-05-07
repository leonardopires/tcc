import axios from "axios";

export class UploadService {
  private baseURL: string = "https://localhost:8000";
  async upload(files: File[]) {
    let formData = new FormData();

    for (let file of files) {
      formData.append(file.name, file);
    }

    await axios({
      baseURL: this.baseURL,
      url: "upload",
      data: formData,
    })
  }
}