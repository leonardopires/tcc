import placeHolderImage from "./placeholderImage.svg";
import {revoicerTheme} from "../../theme/revoicerTheme";
import {Box, Grid, IconButton, Typography} from "@mui/material";
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
    <Box sx={{p:0, mb:2}}>
        <FileUpload
          id={id}
          title={""}
          header={"Faça o upload"}
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
          BannerProps={{className: "rev-FileUpload-banner", style: theme.custom.FileUploadBanner, sm: 10}}
          ContainerProps={{style: theme.custom.FileUploadContainer, sm: 8}}
          LabelsGridProps={{style: theme.custom.FileUploadLabels, sm: 8}}
          PlaceholderGridProps={{style: theme.custom.FileUploadImage, sm: 2}}
          imageSrc={placeHolderImage}
          onError={(error: Error) => {
            console.error(error);
          }}
        />
    </Box>
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