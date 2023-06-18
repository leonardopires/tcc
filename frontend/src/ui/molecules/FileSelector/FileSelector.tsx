import placeHolderImage from "./placeholderImage.svg";
import {revoicerTheme} from "../../theme/revoicerTheme";
import {Grid, IconButton, Typography} from "@mui/material";
import {UploadIcon} from "../../atoms/UploadIcon/UploadIcon";
// @ts-ignore
import FileUpload from "react-mui-fileuploader";
// @ts-ignore
import {ExtendedFileProps} from "react-mui-fileuploader/dist/types/index.types";

const theme = revoicerTheme();

export interface IFileSelectorProps {
  id: string;
  onChange: ((files: ExtendedFileProps[]) => void);
  canAdd: boolean;
  files: ExtendedFileProps[],
  showChangeFileMessage?: false,
};

let selectedFiles: ExtendedFileProps[] = [];

export function FileSelector(props: IFileSelectorProps) {
  const {
    id,
    onChange,
    canAdd,
    files,
    showChangeFileMessage
  } = props;

  function handleChange(files: ExtendedFileProps[]) {
    let newFiles = [...files];

    if (newFiles.length !== selectedFiles.length) {
      selectedFiles = newFiles;
      onChange(newFiles);
    }
  }

  return files.length === 0 ? (
    <FileUpload
      id={id}
      title={""}
      header={""}
      buttonLabel={"Selecionar Arquivos"}
      buttonRemoveLabel={"Remover"}
      rightLabel={""}
      leftLabel={"Arraste aqui o arquivo que deseja enviar para o revoice ou clique no botão"}
      onFilesChange={handleChange}
      maxUploadFiles={1}
      allowedExtensions={["mp3", "mpeg"]}
      multiFile={false}
      acceptedType={"audio/mp3"}
      bannerProps={{
        hidden: !canAdd,
      }}
      BannerProps={{className: "rev-FileUpload-banner", style: theme.custom.FileUploadBanner}}
      ContainerProps={{style: theme.custom.FileUploadContainer}}
      LabelsGridProps={{style: theme.custom.FileUploadLabels}}
      PlaceholderGridProps={{style: theme.custom.FileUploadImage}}
      imageSrc={placeHolderImage}
      onError={(error: Error) => {
        console.error(error);
      }}
    />
  ) : (
    (showChangeFileMessage ? (
      <Grid container style={theme.custom.FileUploadContainer} columns={9}>
        <Grid item xs={8} paddingY={"1em"}>
          <Typography>Deseja selecionar outro arquivo?</Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={() => onChange([])}><UploadIcon/></IconButton>
        </Grid>
      </Grid>
    ) : <></>)
  );
}