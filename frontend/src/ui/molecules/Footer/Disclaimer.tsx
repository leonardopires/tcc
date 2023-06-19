import {PropsWithChildren} from "react";
import {Box, Typography} from "@mui/material";

export interface IDisclaimerProps extends PropsWithChildren {
  italic?: boolean;
}

export function Disclaimer({children, italic = false}: IDisclaimerProps) {
  return <Box mt={2}>
    <Typography
      fontStyle={italic ? "italic" : ""}
      fontSize={"7pt"}
    >
      {children}
    </Typography>
  </Box>;
}