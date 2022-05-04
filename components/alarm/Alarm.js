import {
  Badge,
  Box,
  Collapse,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useAlarmNotice } from "../../src/Atom";
import { useToken } from "../../src/hooks";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useUserNotifyWebSocket } from "../../src/websockets/useNotifyWebSocket";

export default (props) => {
  const { token } = props;
  const [toggle, setToggle] = useState(false);
  const [alarms, setAlarms] = useAlarmNotice(token.user_id);
  useUserNotifyWebSocket(token.user_id);
  const [open, setOpen] = useState(false);
  return (
    <Box
      sx={{
        position: "fixed",
        top: "0",
        right: 30,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "right" }}>
        <IconButton
          onMouseOver={() => {
            setToggle(true);
          }}
          sx={{ right: 0 }}
        >
          <Badge
            badgeContent={alarms.filter((res) => res.check == false).length}
            color="primary"
            onClick={() => {
              setOpen(!open);
              setAlarms(
                alarms.map((res) => {
                  if (res.check == false) {
                    return { ...res, check: true };
                  } else {
                    return res;
                  }
                })
              );
            }}
          >
            {alarms.length >= 1 ? (
              <NotificationsActiveIcon />
            ) : (
              <NotificationsNoneIcon />
            )}
          </Badge>
        </IconButton>
      </Box>
      <Collapse in={open}>
        <Stack>
          {alarms.map((res, idx) => {
            return (
              <Typography
                key={idx}
                onClick={() => {
                  setAlarms(alarms.filter((res, _idx) => idx != _idx));
                }}
              >
                {res.message}
              </Typography>
            );
          })}
        </Stack>
      </Collapse>
    </Box>
  );
};
