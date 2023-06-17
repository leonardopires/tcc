import trackStatusOn from "./trackStatusOn.svg"

export function TrackStatus({status = false}: {status?: boolean}) {
  let sizeInPx = "16px";
  let style = status ? {} : {filter: "grayscale(100%)"}
  return <img src={trackStatusOn} height={sizeInPx} width={sizeInPx} style={style} />
}