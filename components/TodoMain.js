import { useEffect, useRef, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DeleteIcon from "@material-ui/icons/Delete";
import ShowCard from "./ShowCard";
import {
  Button,
  FormControl,
  IconButton,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { useWindowSize } from "../src/hooks/useWindowSize";
import theme from "../src/theme";
import {
  useCategoryAtom,
  useCurPage,
  useCurrentProject,
  useTodoAtom,
} from "../src/Atom";
import { useAccountsInfo, useLogout } from "../src/hooks";
import NavBar from "./NavBar";
import TodoList from "./todos/TodoContainer";
import { getProjects } from "../src/hooks/todoHooks";
import TodoContainer from "./todos/TodoContainer";
export default function TodoMain(props) {
  const { token } = props;
  const [userInfo, userInfoDummy] = useAccountsInfo();
  const [curProject, setCurProject] = useCurrentProject();
  const [projects, addProjects] = getProjects(userInfo.user_id);
  const [curPage, setCurPage] = useCurPage();
  useEffect(() => {
    if (projects.length >= 1 && !curProject.project_id) {
      setCurProject(projects[0]);
    }
  }, []);
  const logout = useLogout();
  function projectHandler(e) {
    const data = new FormData(e.currentTarget);
    e.preventDefault();
    addProjects(data.get("projectname"), token);
    setCurPage(1);
  }
  function PageSelector() {
    if (curPage === 0) {
      return (
        <MakeProjectButton onSubmit={projectHandler} setPage={setCurPage} />
      );
    } else {
      return <TodoContainer token={token} userInfo={userInfo}></TodoContainer>;
    }
  }
  return (
    <Box>
      <NavBar
        projects={projects}
        curProject={curProject}
        setCurProject={setCurProject}
        setCurPage={setCurPage}
        logOut={logout}
      ></NavBar>
      <PageSelector />
    </Box>
  );
}

const MakeProjectButton = (props) => {
  const { onSubmit } = props;
  return (
    <Box component="form" noValidate onSubmit={onSubmit}>
      <TextField
        required
        id="projectname"
        label="projectname"
        name="projectname"
      />
      <Button type="submit" variant="contained">
        생성!
      </Button>
    </Box>
  );
};
