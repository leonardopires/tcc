import {stringToColor} from "./StringToColor.tsx";

export function stringAvatar(name: string) {
  let nameWords = name.split(' ');
  return {
    children: nameWords[0][0],
    sx: {
      border: "solid 3px black",
      bgcolor: stringToColor(name),
    },
  };
}