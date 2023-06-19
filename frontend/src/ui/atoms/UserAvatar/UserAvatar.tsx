import {IRevoicerUser} from "../../../models/IRevoicerUser.ts";
import {Avatar} from "@mui/material";
import {stringAvatar} from "../../molecules/UserAvatar/StringAvatar.tsx";
import {LoginRounded} from "@mui/icons-material";

export function UserAvatar(props: { user?: IRevoicerUser }) {
  const {user} = props;

  return user ? (
    <Avatar size={"small"} {...stringAvatar(user?.name)}/>
  ) : <LoginRounded/>;
}