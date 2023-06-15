export class FileService {
  static formatName(filePath: string): string {
    return filePath.split("/").pop() || "No name";
  }
}