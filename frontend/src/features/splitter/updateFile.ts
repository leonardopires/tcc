import {IRevoiceJob} from "../revoicer/IRevoiceJob";


export function updateFile(files: IRevoiceJob[], outputFile: IRevoiceJob) {
  let finalFiles = new Map<string, IRevoiceJob>();
  for (let file of files) {
    finalFiles.set(file.filePath as string, file);
  }
  finalFiles.set(outputFile.filePath as string, outputFile);
  let values = [...finalFiles.values()];
  return values;
}