import {
  Box,
  Button,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { TODO } from "../../src/API/todo";
import { useCurrentProject, usePortal } from "../../src/Atom";
import { isCategoryEditable } from "../../src/hooks";
import useCategory from "../../src/hooks/useCategory";
import TodoList from "./TodoList";
export default (props) => {
  const { token, userInfo } = props;
  const [curProject, setCurProject] = useCurrentProject();
  const [categories, setCategories, consRemover, makeCategory] = useCategory();
  const categoryEditable = isCategoryEditable();
  const [portal, setPortal] = usePortal();
  useEffect(() => {
    if (categoryEditable) {
      setPortal(
        <FormControl
          component="form"
          onSubmit={makeCategory}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <TextField
            name="categoryname"
            label="카테고리"
            size="small"
            autoComplete="off"
          ></TextField>
          <Button type="submit" variant="contained">
            추가
          </Button>
        </FormControl>
      );
    } else {
      setPortal(null);
    }
  }, [curProject]);
  return (
    <Stack
      sx={{ display: "flex", justifyContexnt: "center", alignItems: "center" }}
    >
      <Box>
        <Typography component="h1">{curProject.project_name}</Typography>
      </Box>
      <Stack
        direction="row"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "start",
          minWidth: `${
            250 * categories.length < 900 ? 250 * categories.length : 900
          }px`,
        }}
      >
        {categories.map((res, idx) => {
          return (
            <TodoList
              key={idx}
              project={curProject}
              categories={categories}
              category={res}
              userInfo={userInfo}
              consRemover={consRemover}
              categoryEditable={categoryEditable}
              token={token}
            ></TodoList>
          );
        })}
      </Stack>
    </Stack>
  );
};
