import {ComponentsOverrides, createTheme, CSSInterpolation, PaletteColorOptions, Theme} from "@mui/material";
import {amber, grey, orange, yellow} from "@mui/material/colors";
import React from "react";

export interface RevoicerTheme extends Theme {
  custom: {
    FileUploadBanner: React.CSSProperties,
    FileUploadContainer: React.CSSProperties,
    FileUploadLabels: React.CSSProperties,
    FileUploadImage: React.CSSProperties,
    [indexer: string]: React.CSSProperties,
  };

  getCustomOverride(type: string): React.CSSProperties;
};

export function revoicerTheme(): RevoicerTheme {
  let alfaSlabOne = "'Alfa Slab One', serif";
  let poppins = "'Poppins', Arial, sans-serif";
  let title = {
    fontFamily: alfaSlabOne,
    marginBottom: "0.5em",
    marginTop: "0.5em",
  };

  let black: PaletteColorOptions = {
    main: "#1F1808",
  }

  let muiTheme = createTheme({
    palette: {
      primary: black,
      secondary: amber,
      background: {
        paper: amber.A100,
        default: orange.A200,
      },
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          position: "sticky",
        },
        styleOverrides: {
          root: {
            background: "transparent",
            boxShadow: "none",
            alignItems: "center",
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          outlined: {
            borderColor: "#1F1808 !important",
            borderWidth: "3px",
            borderRadius: "2em",
            backgroundColor: "transparent",
            color: "#1F1808 !important",
            ":hover": {
              borderWidth: "3px",
            },
          },
          containedPrimary: {
            backgroundColor: "#1F1808",
          },
          root: {
            color: "#F2D83E !important",
            fontFamily: alfaSlabOne,
          },
          contained: {
            borderColor: "#1F1808 !important",
            borderRadius: "2em",
          }
        }
      },
    },
    typography: {
      allVariants: {
        color: "#000",
        fontFamily: poppins,
      },
      h1: {...title, fontSize: "3em"},
      h2: {...title, fontSize: "2em"},
      h3: {...title, fontSize: "1.8em"},
      h4: {...title, fontSize: "1.4em", marginBottom: 0},
      h5: { fontFamily: poppins, fontSize: "0.9em", fontWeight: 250, marginBottom: "0.5em"},
      h6: {...title, fontSize: "1em", marginBottom: 0, marginTop: "-0.2em"},
    },
  });
  let theme: RevoicerTheme = {
    ...muiTheme,
    custom: {
      FileUploadBanner: {},
      FileUploadContainer: {
        background: "rgba(89, 75, 22, 0.15)",
        borderColor: "#1F1808",
        borderWidth: "3px",
        borderStyle: "dashed",
        borderRadius: 0,
        padding: "0.2em 3em",
        marginBottom: "2em",
      },
      FileUploadLabels: {
        textAlign: "left",
        marginTop: "-2em"
      },
      FileUploadImage: {
        marginLeft: "3em",
        marginTop: "-1em"
      },
    },
    getCustomOverride(type: string): React.CSSProperties {
      return this.custom[type];
    }
  };

  return theme;
}