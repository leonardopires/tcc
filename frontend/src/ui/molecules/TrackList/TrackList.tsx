import {IRevoiceJob} from "../../../features/revoicer/revoicerSlice";
import React, {Fragment} from "react";
import {Track} from "../Track/Track";


export function TrackList({files, type}: { files: IRevoiceJob[], type: string }) {

  return <>
    {files.map(file => {
      let fileElement = file[type] as string[];
      return (
        <Fragment key={`${type}_${file.name}`}>
          <div>
            {fileElement
              .filter(childFile => childFile.endsWith(".aac") || childFile.endsWith(".mp3"))
              .map(childFile => {
                return <Track file={childFile} type={type} />;
              })
            }
          </div>
        </Fragment>
      );
    })}
  </>;
}