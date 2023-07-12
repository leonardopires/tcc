import logo from "./logo.svg";
import logoLight from "./logo-light.svg";

export enum LogoColor {
  Dark,
  Light
}


export function Logo({width = "120px", color = LogoColor.Dark}) {
  const image = new Map<LogoColor, string>([
    [LogoColor.Dark, logo],
    [LogoColor.Light, logoLight],
  ]);

  return <img src={image.get(color) ?? logo} width={width} alt={"Revoicer"}/>;
}