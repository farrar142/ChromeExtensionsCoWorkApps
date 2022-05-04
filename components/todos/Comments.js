import {
  Alert,
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControl,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useRef, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { TODO } from "../../src/API/todo";
import useComment from "../../src/hooks/useComment";
import {
  useCommentInput,
  useCurFocusElem,
  useCurrentFocus,
} from "../../src/Atom";
const comment_id = "1rem";
const comment_message = "1rem";
export const Comments = (props) => {
  const { comments, token, todo, todos, setTodos, isTodoEditable } = props;
  const [alMessage, setAlMessage, registerComment, deleteComment] = useComment(
    todos,
    setTodos,
    todo
  );
  const [message, setMessage] = useCommentInput(todo.id);
  const commentId = `comment${todo.id}`;
  const [latest, setLatest] = useCurFocusElem();
  return (
    <Stack>
      {comments
        .map((res) => res)
        .sort((a, b) => a.id - b.id)
        .map((res, idx) => {
          const RemoveRender = () => {
            if (isTodoEditable() || res.author_id == token.user_id) {
              return (
                <IconButton
                  sx={{ pr: 1 }}
                  onClick={() => {
                    deleteComment(res);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              );
            }
          };
          return (
            <Box key={res.id + idx}>
              <Divider />
              <Stack direction="row">
                <Box sx={{ padding: 0.5 }}></Box>
                <Divider />
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ ...flex, flexDirection: "row" }}>
                    <AccountCircleIcon sx={{ marginRight: "5px" }} />
                    <Typography
                      sx={{ margin: 0.7, fontSize: comment_id, width: "100%" }}
                    >
                      {res.author_name}
                    </Typography>
                    {RemoveRender()}
                  </Box>
                  <Divider />
                  <Typography
                    sx={{
                      margin: 0.5,
                      marginleft: 1,
                      fontSize: comment_message,
                    }}
                  >
                    {res.message}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          );
        })}
      <FormControl
        onSubmit={(e) => {
          setMessage("");
          registerComment(e);
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
          id={commentId}
          onFocus={(e) => {
            setLatest(commentId);
            const target = window.document.querySelector("#" + commentId);
            target.focus();
          }}
          size="small"
          name="message"
          label="댓글입력"
        ></TextField>
        <Button type="submit" variant="contained">
          댓글등록
        </Button>
      </FormControl>
    </Stack>
  );
};
const flex = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
