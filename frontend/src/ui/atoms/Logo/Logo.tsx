import logo from "./logo.svg";

export function Logo({width = "120px"}) {
  return <img src={logo} width={width}  alt={"Revoicer"}/>;
}