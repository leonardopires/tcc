import React from "react";
import FileUpload from "react-mui-fileuploader";
import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";


export interface IFileSelectorProps {
  id: string;
  onChange: ((files: ExtendedFileProps[]) => void) | undefined;
};

export function FileSelector(props: IFileSelectorProps) {
  const {id,onChange} = props;

  return (
      <FileUpload
        id={id}
        title={""}
        header={"Drop your song here"}
        onFilesChange={onChange}
        allowedExtensions={["mp3", "mpeg"]}
        acceptedType={"audio/mpeg"}
      />
  );
}