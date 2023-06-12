export interface IRevoiceJob {
  contentType?: string;
  jobId?: string;
  operationId?: string;
  voice: string;
  name: string;
  filePath: string;
  size: number;
  type: string;
  extension: string | undefined;
  lastModified?: string | Date;
  lastModifiedDate?: string | Date;
  input: string[];
  split: string[];
  revoiced: string[];

  [index: string]: any;
}