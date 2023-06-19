// @ts-ignore
import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";
import {Box, Typography} from "@mui/material";
import {FileSelector} from "../molecules/FileSelector";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {filesChanged} from "../../features/splitter/filesChanged.ts";
import {uploadAndSplit} from "../../features/revoicer/uploadAndSplit.ts";
import {BeginSplitStep} from "../organisms/BeginSplitStep.tsx";
import {UploadInstructions} from "./UploadInstructions.tsx";


export function UploadPage() {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector(state => state.revoicer.uploadedFiles);
  const status = useAppSelector(state => state.revoicer.status);

  const songInfo = useAppSelector(state => state.revoicer.songInfo);

  let job = jobs[0];

  let onUploadClick = () => dispatch(uploadAndSplit());


  return (
    <Box>
      <Typography variant={"h2"}>Upload & Split</Typography>
      <FileSelector
        id={"song"}
        onChange={(files) => dispatch(filesChanged(files))}
        canAdd={jobs.length === 0}
        files={jobs.map(item => item as any as ExtendedFileProps)}
      />
      {(jobs.length > 0 && songInfo) ? (
        <BeginSplitStep
          status={status}
          job={job}
          onStart={onUploadClick}
          onDiscard={() => window.location.reload()}
        />
      ) : (
        <UploadInstructions/>
      )}
    </Box>
  );
};