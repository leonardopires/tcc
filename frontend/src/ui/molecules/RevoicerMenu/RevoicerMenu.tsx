import {ReactElement, useState} from "react";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {Menu as MenuIcon} from "@mui/icons-material";


export interface IMenuAction {
  name: string;
}

export interface IRevoicerMenuProps {
  id: string;
  icon?: ReactElement;
  actions?: IMenuAction[];
}

export function RevoicerMenu({actions = [], icon = <MenuIcon/>, id}: IRevoicerMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return <>
    <IconButton
      edge={"start"}
      color={"inherit"}
      aria-label={"menu"}
      sx={{mr: 2}}
      onClick={handleOpen}
      size="small"
      aria-controls={open ? 'account-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
    >
      {icon}
    </IconButton>
    {actions?.length > 0 ? (
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }
        }}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      >
        {actions.map(action => (
          <MenuItem key={action.name}>
            {action.name}
          </MenuItem>
        ))}
      </Menu>
    ) : (<></>)
    }
  </>;
}