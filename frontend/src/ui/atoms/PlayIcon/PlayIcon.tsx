import playIcon from "./playIcon.svg"

export function PlayIcon({size = "30px"}) {
  return <img src={playIcon} width={size} height={size} style={{marginLeft: "20%"}} />
}