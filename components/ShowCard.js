import {
  Badge,
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CommentIcon from "@material-ui/icons/Comment";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import { CheckList } from "./todos/CheckList";
import { Comments } from "./todos/Comments";
import CreateTodo from "./todos/CreateTodo";
import theme from "../src/theme";
import { useConOpenAtom } from "../src/Atom";
import MoreIcon from "@material-ui/icons/MoreVert";
const todo_id = "1rem";
const todo_message = "1rem";
export default (props) => {
  const { token, todos, setTodos, registerTodo, deleteTodo, categoryIdx } =
    props;
  const [search, setSearch] = useState("");
  const searchHandler = (e) => {
    setSearch(e.target.value);
  };
  const TodoMapper = () => {
    return todos.map((res, idx) => {
      const [commentOpen, setCommentOpen] = useConOpenAtom(
        `${categoryIdx}/${res.id}/${idx}/comment`
      );
      const [checkListOpen, setCheckListOpen] = useConOpenAtom(
        `${categoryIdx}/${res.id}/${idx}/checklist`
      );
      //검색필터
      if (
        res.message.includes(search) ||
        res.owner.includes(search) ||
        //체크리스트필터
        res.checkList.filter((_res) => {
          return _res.message.includes(search);
        }).length >= 1
      ) {
        return (
          <Paper sx={{ my: 1 }} key={res.id + res.message}>
            <Stack direction="column">
              <Box sx={{ ...flex, flexDirection: "row", pl: 1 }}>
                <AccountCircleIcon />
                <Typography
                  sx={{ margin: 0.5, fontSize: todo_id, width: "100%" }}
                >
                  {res.owner}
                </Typography>
                <IconButton
                  onClick={() => {
                    deleteTodo(res);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton>
                  <MoreIcon />
                </IconButton>
              </Box>
              <Divider />
              <Typography
                sx={{ margin: 0.5, marginLeft: 1.5, fontSize: todo_message }}
              >
                {res.message}
              </Typography>
              <Divider />
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box sx={{ width: "100%" }}></Box>
                <Badge
                  badgeContent={!checkListOpen ? res.checkList.length : 0}
                  color="primary"
                  onClick={() => {
                    setCheckListOpen();
                  }}
                >
                  <IconButton>
                    <FormatListNumberedIcon />
                  </IconButton>
                </Badge>
                <Badge
                  badgeContent={!commentOpen ? res.comment.length : 0}
                  color="primary"
                  onClick={() => {
                    setCommentOpen();
                  }}
                >
                  <IconButton>
                    <CommentIcon />
                  </IconButton>
                </Badge>
              </Box>
              <Collapse in={checkListOpen}>
                <CheckList
                  token={token}
                  A
                  checkList={res.checkList}
                  todoIdx={idx}
                  todos={todos}
                  setTodos={setTodos}
                />
              </Collapse>
              <Collapse in={commentOpen}>
                <Comments
                  token={token}
                  A
                  comment={res.comment}
                  todoIdx={idx}
                  todos={todos}
                  setTodos={setTodos}
                />
              </Collapse>
            </Stack>
          </Paper>
        );
      } else {
        return <div key={idx}></div>;
      }
    });
  };
  return (
    <Stack>
      <TextField
        size="small"
        sx={{ my: 1 }}
        value={search}
        onChange={searchHandler}
        label="검색"
      ></TextField>
      <CreateTodo todos={todos} registerTodo={registerTodo}></CreateTodo>
      <TodoMapper />
    </Stack>
  );
};
const styles = (theme) => ({
  badgeIcon: {
    margin: 1,
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.primary.main,
      background: theme.palette.effect.main,
      borderRadius: "5px",
      transition: "0.3s",
    },
  },
});
const flex = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
