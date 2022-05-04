import {
  Badge,
  Button,
  Collapse,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { memo, useEffect, useRef, useState } from "react";
import { useDM, useDmNotice, useDmOpen } from "../../src/Atom";
import { useAccountsInfo } from "../../src/hooks";
import { useDMWebSocket } from "../../src/websockets/useDMWebSocket";
import MenuIcon from "@mui/icons-material/Menu";

const messagesAreEquals = (prev, next) => {
  return prev.messages === next.messages && prev.room === next.room && false;
};
const friendsAreEquals = (prev, next) => {
  return prev.rooms === next.rooms && false;
};
export default (props) => {
  const { rooms, setRooms } = props;
  const [test, setTest] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [dmNotice, setDmNotice] = useDmNotice();
  const leaveDM = (user) => {
    setRooms(
      rooms.filter((res) => {
        return res.id != user.id;
      })
    );
    setTest([...test, rooms]);
  };
  const offContainer = () => {
    setToggle(false);
  };
  return (
    <Box
      sx={{
        position: "fixed",
        top: "0",
        right: "0",
      }}
    >
      <IconButton
        onMouseOver={() => {
          setToggle(true);
        }}
      >
        <Badge
          badgeContent={dmNotice.filter((res) => res.check == true).length}
          color="primary"
        >
          <MenuIcon />
        </Badge>
      </IconButton>
      <Drawer open={toggle} onClose={offContainer} anchor="right">
        <Stack onMouseLeave={offContainer} sx={{ height: "100%" }} spacing={1}>
          <DMRender
            rooms={rooms}
            leaveDM={leaveDM}
            offContainer={offContainer}
          />
        </Stack>
      </Drawer>
    </Box>
  );
};
const DMRender = memo((props) => {
  const { rooms, leaveDM, offContainer } = props;
  if (rooms.length >= 1) {
    return (
      <Box>
        {rooms.map((res) => {
          return (
            <DMBox
              key={res.id}
              room={res}
              // messages={messages}
              // messageHandler={messageHandler}
              leaveDM={leaveDM}
              offContainer={offContainer}
            />
          );
        })}
      </Box>
    );
  } else {
    return <Box>진행중인 대화가 없어요.</Box>;
  }
}, friendsAreEquals);
const DMBox = memo((props) => {
  const { room, leaveDM } = props;
  const [open, setOpen] = useDmOpen(room.id);
  const [tmpMessage, setTmpMessage] = useState("");
  const [messages, messageHandler, ws] = useDMWebSocket(room);
  const [dmNotice, setDmNotice] = useDmNotice();
  const dmRemover = (room) => {
    setDmNotice(dmNotice.filter((res) => res.id !== room.id));
  };
  return (
    <Paper
      key={room.id}
      onClick={() => {
        dmRemover(room);
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Button
          sx={{ width: "70%" }}
          onClick={() => {
            setOpen(!open);
            dmRemover(room);
          }}
          size="small"
        >
          <Badge
            badgeContent={dmNotice.filter((res) => res.id == room.id).length}
          >
            {room.username}
          </Badge>
        </Button>
        <Tooltip title={`user_id${room.id}`}>
          <Button
            onClick={() => {
              ws.close();
              leaveDM(room);
            }}
            size="small"
          >
            나가기
          </Button>
        </Tooltip>
      </Box>
      <Collapse in={open}>
        <FormControl
          component="form"
          sx={{ display: "flex" }}
          onSubmit={(e) => {
            messageHandler(e, setTmpMessage);
          }}
        >
          <MessageContainer messages={messages} room={room} />
          <TextField
            name="message"
            sx={{ width: "100%" }}
            size="small"
            value={tmpMessage}
            id={`textfield_${room.id}`}
            onChange={(e) => {
              setTmpMessage(e.target.value);
            }}
            autoComplete="off"
          />
          <Button size="small" type="submit">
            보내기!
          </Button>
        </FormControl>
      </Collapse>
    </Paper>
  );
}, messagesAreEquals);

const MessageContainer = memo((props) => {
  const { messages, room } = props;
  useEffect(() => {
    try {
      const target = window.document.querySelector(
        `#chat_${room.id}_${messages.length - 1}`
      );
      target.scrollIntoView();
    } catch {}
  }, [messages]);
  return (
    <Paper sx={{ maxHeight: "200px", overflow: "auto" }}>
      {messages
        .filter((res) => res.username)
        .map((res, idx) => {
          return (
            <Box
              key={idx}
              id={`chat_${room.id}_${idx}`}
              sx={{ display: "flex", flexDirection: "row", maxWidth: "200px" }}
            >
              <Typography>{res.username}</Typography> :
              <Typography>{res.message}</Typography>
            </Box>
          );
        })}
    </Paper>
  );
}, messagesAreEquals);
