import {
  Badge,
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState, memo } from "react";
import CommentIcon from "@material-ui/icons/Comment";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { CheckList } from "./CheckList";
import { Comments } from "./Comments";
import CreateTodo from "./CreateTodo";
import theme from "../../src/theme";
import LinearWithValueLabel from "./decoration/LinearWithValueLabel";
import { useConOpenAtom, useCurrentFocus } from "../../src/Atom";
import MoreIcon from "@material-ui/icons/MoreVert";
import { TODO } from "../../src/API/todo";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { findFocusedElement } from "../../src/hooks";
const todo_id = "1rem";
const todo_message = "1rem";
function todosAreEquals(prev, next) {
  const isIt =
    prev.todos === next.todos &&
    prev.category === next.category &&
    prev.project === next.project;
  return isIt;
}
export default memo((props) => {
  const {
    userInfo,
    token,
    todos,
    setTodos,
    registerTodo,
    deleteTodo,
    category,
    project,
    categories,
    modifyTodo,
    categoryEditable,
  } = props;
  const [search, setSearch] = useState("");
  const searchHandler = (e) => {
    setSearch(e.target.value);
  };
  //여기작업중
  const TodoMapper = (props) => {
    return todos.map((res, idx) => {
      const [commentOpen, setCommentOpen] = useConOpenAtom(
        `${project.project_id}/${category.id}/${res.id}/comment`
      );
      const [checkListOpen, setCheckListOpen] = useConOpenAtom(
        `${project.project_id}/${category.id}/${res.id}/checklist`
      );
      // MoreButton Start
      const [anchorEl, setAnchorEl] = useState(null);
      const [transOpen, setTranOpen] = useState(false);
      const [edit, setEdit] = useState(true);
      const anchorRef = useRef(null);
      const open = Boolean(anchorEl);
      const childCheck = res.checkList.filter(
        (_res) => _res.checked == true
      ).length;
      const motherCheck = res.checkList.length;
      const progress = (childCheck / motherCheck) * 100 || 0;
      const isTodoEditable = () => {
        if (categoryEditable || res.author_id == token.user_id) {
          return true;
        } else {
          return false;
        }
      };
      const handleClick = (event) => {
        setAnchorEl(anchorRef.current);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
      const transferTodo = async (category) => {
        const result = await TODO.move_todo(token, res, category);
        if (result) {
        } else {
          alert("err!");
        }
      };
      const tagMatcher = () => {
        const my_tag_id = res.tag;
        const matches = project.tags.filter((res) => res.id === my_tag_id);
        if (matches.length >= 1) {
          return matches[0];
        } else {
          return false;
        }
      };
      const TagRender = () => {
        const my_tag = tagMatcher();
        if (my_tag) {
          return (
            <Box sx={{ display: "flex", mr: 1 }}>
              <Box
                sx={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: my_tag.code,
                  mr: 1,
                }}
              ></Box>
              <Typography>[{my_tag.name}] : </Typography>
            </Box>
          );
        }
      };
      const ProgRender = () => {
        if (res.checkList.length > 0) {
          return <LinearWithValueLabel value={progress} />;
        } else {
          return <Box />;
        }
      };
      const MenuRender = () => {
        if (isTodoEditable()) {
          return (
            <IconButton onClick={handleClick}>
              <MoreIcon />
            </IconButton>
          );
        } else {
          return <Box></Box>;
        }
      };
      if (
        res.message.includes(search) ||
        res.author_name.includes(search) ||
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
                  {res.author_name}
                </Typography>
                <Box ref={anchorRef}>
                  <MenuRender />
                </Box>
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <MenuItem
                    sx={{ display: "flex" }}
                    onClick={(e) => {
                      handleClose(e);
                      deleteTodo(res);
                    }}
                  >
                    <Typography sx={{ width: "100%" }}>삭제</Typography>
                    <DeleteIcon />
                  </MenuItem>
                  <MenuItem
                    sx={{ display: "flex" }}
                    onClick={(e) => {
                      handleClose(e);
                      setEdit(!edit);
                    }}
                  >
                    <Typography sx={{ width: "100%" }}>수정</Typography>
                    <EditIcon />
                  </MenuItem>
                  <MenuItem
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onMouseOver={() => setTranOpen(true)}
                    onMouseLeave={() => setTranOpen(false)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                      }}
                    >
                      <Typography sx={{ width: "100%" }}>항목이동</Typography>
                      <DriveFileMoveIcon />
                    </Box>
                    `
                    <Collapse in={transOpen}>
                      <Divider />
                      {categories
                        .filter((cat) => cat.id != category.id)
                        .map((cat, idx) => {
                          return (
                            <MenuItem
                              key={cat.id + idx}
                              onClick={() => {
                                transferTodo(cat);
                              }}
                            >
                              {idx}:{cat.name}
                            </MenuItem>
                          );
                        })}
                      <Divider />
                    </Collapse>
                  </MenuItem>
                </Menu>
              </Box>
              <Divider />
              <Collapse
                in={edit}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Typography
                  sx={{
                    maxWidth: "300px",
                    margin: 0.5,
                    marginLeft: 1.5,
                    fontSize: todo_message,
                    display: "flex",
                  }}
                >
                  {TagRender()} {res.message}
                </Typography>
              </Collapse>
              <Collapse in={!edit}>
                <FormControl
                  component="form"
                  onSubmit={(e) => {
                    setEdit(!edit);
                    modifyTodo(e, res);
                  }}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <TextField
                    name="message"
                    label="수정"
                    size="small"
                    sx={{ width: "100%" }}
                    defaultValue={res.message}
                  />
                  <Button variant="contained" size="small" type="submit">
                    확인
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      setEdit(!edit);
                    }}
                  >
                    취소
                  </Button>
                </FormControl>
              </Collapse>
              <Divider />
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    pl: 2,
                  }}
                >
                  <ProgRender />
                </Box>
                <Badge
                  badgeContent={
                    !checkListOpen
                      ? res.checkList.filter((res) => res.checked == false)
                          .length
                      : 0
                  }
                  color="primary"
                  onClick={() => {
                    setCheckListOpen();
                  }}
                >
                  <Tooltip title="체크리스트 보기">
                    <IconButton>
                      <FormatListNumberedIcon />
                    </IconButton>
                  </Tooltip>
                </Badge>
                <Badge
                  badgeContent={!commentOpen ? res.comment.length : 0}
                  color="primary"
                  onClick={() => {
                    setCommentOpen();
                  }}
                >
                  <Tooltip title="코멘트보기">
                    <IconButton>
                      <CommentIcon />
                    </IconButton>
                  </Tooltip>
                </Badge>
              </Box>
              <Collapse in={checkListOpen}>
                <CheckList
                  token={token}
                  A
                  checkList={res.checkList}
                  todo={res}
                  todos={todos}
                  setTodos={setTodos}
                  isTodoEditable={isTodoEditable}
                />
              </Collapse>
              <Collapse in={commentOpen}>
                <Comments
                  token={token}
                  userInfo={userInfo}
                  comments={res.comment}
                  todo={res}
                  todos={todos}
                  setTodos={setTodos}
                  isTodoEditable={isTodoEditable}
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
      <CreateTodo
        todos={todos}
        registerTodo={registerTodo}
        project={project}
      ></CreateTodo>
      <TodoMapper todos={todos} />
    </Stack>
  );
}, todosAreEquals);
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
