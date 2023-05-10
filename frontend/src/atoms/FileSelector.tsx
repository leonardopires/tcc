import React from "react";
import FileUpload from "react-mui-fileuploader";
import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";


export interface IFileSelectorProps {
  id: string;
  onChange: ((files: ExtendedFileProps[]) => void) | undefined;
  canAdd: boolean;
};

export function FileSelector(props: IFileSelectorProps) {
  const {id,onChange, canAdd} = props;

  return (
      <FileUpload
        id={id}
        title={""}
        header={"Drop your song here"}
        onFilesChange={onChange}
        maxUploadFiles={1}
        allowedExtensions={["mp3", "mpeg"]}
        multiFile={false}
        acceptedType={"audio/mpeg"}
        bannerProps={{hidden: !canAdd}}
        onError={(error) => console.error(error)}
      />
  );
}