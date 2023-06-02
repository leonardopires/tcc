import {RevoicerStatus} from "../features/revoicer/revoicerSlice";

export class ButtonsConfig {
  public static uploadButtonDisabledWhen = [
    RevoicerStatus.Empty,
    RevoicerStatus.Uploading,
    RevoicerStatus.Uploaded,
    RevoicerStatus.Splitting,
    RevoicerStatus.Revoicing,
    RevoicerStatus.Splitting,
    RevoicerStatus.Split,
  ];
  public static splitButtonDisabledWhen = [
    RevoicerStatus.Empty,
    RevoicerStatus.Uploading,
    RevoicerStatus.FilesSelected,
    RevoicerStatus.Splitting,
    RevoicerStatus.Revoicing,
  ];
  public static revoiceButtonDisabledWhen = [
    RevoicerStatus.Empty,
    RevoicerStatus.Uploading,
    RevoicerStatus.Uploaded,
    RevoicerStatus.FilesSelected,
    RevoicerStatus.Splitting,
    RevoicerStatus.Revoicing,
  ];
}