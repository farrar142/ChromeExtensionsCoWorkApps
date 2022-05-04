import DeleteIcon from "@material-ui/icons/Delete";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { TODO } from "../../src/API/todo";
import useTodo from "../../src/hooks/useTodo";
import theme from "../../src/theme";
import TodoItem from "./TodoItem";
import { isCategoryEditable } from "../../src/hooks";
export default (props) => {
  const {
    category,
    consRemover,
    userInfo,
    token,
    project,
    categories,
    categoryEditable,
  } = props;
  const style = styles(theme);
  const [todos, setTodos, registerTodo, deleteTodo, modifyTodo] = useTodo(
    project,
    category
  );
  const RenderRemoveButton = () => {
    if (categoryEditable) {
      return (
        <IconButton
          onClick={(e) => {
            consRemover(e, category);
          }}
        >
          <DeleteIcon />
        </IconButton>
      );
    } else {
      return <Box></Box>;
    }
  };
  return (
    <Paper key={category.id + category.name} sx={style.paperBack}>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Typography sx={{ width: "100%" }}>
          {category.name} ({todos.length})
        </Typography>
        <RenderRemoveButton />
      </Box>
      <TodoItem
        categoryEditable={categoryEditable}
        userInfo={userInfo}
        category={category}
        categories={categories}
        project={project}
        registerTodo={registerTodo}
        deleteTodo={deleteTodo}
        todos={todos}
        setTodos={setTodos}
        modifyTodo={modifyTodo}
        {...props}
      />
    </Paper>
  );
};

const styles = (theme) => ({
  paperBack: { background: theme.palette.paperBack.main, my: 4, p: 2, mx: 1 },
});
