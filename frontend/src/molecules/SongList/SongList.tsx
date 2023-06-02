import {IRevoiceJob} from "../../features/revoicer/revoicerSlice";
import React, {Fragment} from "react";
import {FileService} from "../../services/FileService";
import ReactAudioPlayer from "react-audio-player";
import {AppConfig} from "../../AppConfig";

export function SongList({files, type}: { files: IRevoiceJob[], type: string }) {
  return <>
    {files.map(file => {
      let fileElement = file[type] as string[];
      return (
        <Fragment key={`${type}_${file.name}`}>
          <div>
            {fileElement
              .filter(childFile => childFile.endsWith(".aac") || childFile.endsWith(".mp3"))
              .map(childFile => (
                <div key={`${type}_${childFile}`}>
                  <h4>{FileService.formatName(childFile)}</h4>
                  <ReactAudioPlayer
                    src={`${AppConfig.api.baseURL}FileManager/redirect?filePath=%2F${encodeURIComponent(childFile)}`}
                    controls={true}
                  />
                </div>
              ))
            }
          </div>
        </Fragment>
      );
    })}
  </>;
}