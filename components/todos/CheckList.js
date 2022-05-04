import {
  Alert,
  Box,
  Checkbox,
  Collapse,
  Divider,
  IconButton,
  FormControl,
  Stack,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@material-ui/icons/Close";
import { TODO } from "../../src/API/todo";
import useCheckList from "../../src/hooks/useCheckList";
import {
  useChecklistInput,
  useCurFocusElem,
  useCurrentFocus,
} from "../../src/Atom";
import { useEffect, useRef, useState } from "react";
const checked_message = "0.7rem";
export const CheckList = (props) => {
  const { checkList, todo, todos, setTodos, isTodoEditable } = props;
  const [alMessage, setAlMessage, modifyCheck, deleteCheck, makeCheck] =
    useCheckList(todos, setTodos, todo);
  const [message, setMessage] = useChecklistInput(todo.id);
  const checklistId = `checklist${todo.id}`;
  const CheckRender = () => {
    const [latest, setLatest] = useCurFocusElem();
    const [curRef, setRef] = useState(null);
    if (isTodoEditable()) {
      return (
        <FormControl
          onSubmit={(e) => {
            setMessage("", null);
            makeCheck(e);
          }}
          component="form"
          sx={{ margin: 0.5 }}
        >
          <Collapse in={alMessage} onClick={() => setAlMessage(false)}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setAlMessage(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              내용을 입력해주세요!
            </Alert>
          </Collapse>
          <TextField
            value={message}
            onChange={(e) => {
              e.preventDefault();
              setMessage(e.target.value);
            }}
            onFocus={(e) => {
              setRef(e.currentTarget);
              setLatest(checklistId);
            }}
            id={checklistId}
            name="message"
            size="small"
            label="체크리스트입력"
          ></TextField>
          <Button type="submit" variant="contained">
            체크리스트등록
          </Button>
        </FormControl>
      );
    } else {
      return;
    }
  };
  return (
    <Stack>
      {checkList.map((res, idx) => {
        const RemoveRender = () => {
          if (isTodoEditable()) {
            return (
              <IconButton sx={{ pr: 1 }} onClick={() => deleteCheck(res)}>
                <CloseIcon />
              </IconButton>
            );
          }
        };
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            key={res.id + res.message + idx}
          >
            <Divider />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Checkbox
                checked={res.checked}
                onClick={() => {
                  if (isTodoEditable()) {
                    modifyCheck(res);
                  }
                }}
              ></Checkbox>
              <Typography
                sx={{
                  margin: 0.5,
                  marginleft: 1,
                  fontSize: checked_message,
                  width: "100%",
                }}
              >
                {res.message}
              </Typography>
              {RemoveRender()}
            </Box>
          </Box>
        );
      })}
      {CheckRender()}
    </Stack>
  );
};
