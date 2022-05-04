import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import {
  useCurPage,
  useCurrentProject,
  useDM,
  usePortal,
} from "../../src/Atom";
import { useAccountsInfo, useLogout } from "../../src/hooks";
import { getProjects } from "../../src/hooks/useProject";
import NavBar from "../NavBar";
import TodoContainer from "./TodoContainer";
import Info from "../accounts/Info";
import DMContainer from "../DM/DMContainer";
import useUser from "../../src/hooks/useUser";
import Alarm from "../alarm/Alarm";
export default function TodoMain(props) {
  const { token } = props;
  const [userInfo, setUserInfo] = useAccountsInfo();
  const [curProject, setCurProject] = useCurrentProject();
  const [rooms, setRooms] = useDM();
  const [
    projects,
    makeProject,
    removeProject,
    appendProject,
    renameProject,
    changeProjectRule,
    joinProject,
    leaveProject,
    banProject,
    createTag,
    modifyTag,
    deleteTag,
  ] = getProjects(userInfo.id);
  const [modifyName, addFriend, removeFriend, requestDM] = useUser(token);
  const [curPage, setCurPage] = useCurPage();
  useEffect(() => {
    if (projects.length >= 1 && !curProject.project_id) {
      setCurProject(projects[0]);
    } else if (projects.length == 0) {
      setCurProject({});
    } else {
      const isit = projects.filter(
        (res) => res.project_id == curProject.project_id
      )[0];
      setCurProject(isit ? isit : projects[0]);
    }
  }, [projects]);
  const logout = useLogout();
  function projectHandler(e) {
    const data = new FormData(e.currentTarget);
    e.preventDefault();
    makeProject(data.get("projectname"), token);
    setTimeout(() => {
      setCurPage(1);
    }, 100);
  }
  function PageSelector() {
    if (curPage === 0) {
      return (
        <MakeProjectButton onSubmit={projectHandler} setPage={setCurPage} />
      );
    } else if (curPage === 2) {
      return (
        <Info
          projects={projects}
          removeProject={removeProject}
          appendProject={appendProject}
          renameProject={renameProject}
          changeProjectRule={changeProjectRule}
          joinProject={joinProject}
          leaveProject={leaveProject}
          banProject={banProject}
          modifyName={modifyName}
          addFriend={addFriend}
          removeFriend={removeFriend}
          requestDM={requestDM}
          createTag={createTag}
          modifyTag={modifyTag}
          deleteTag={deleteTag}
        ></Info>
      );
    } else {
      if (projects.length == 0) {
        console.log("프로젝트없음");
        setCurPage(0);
      }
      return <TodoContainer token={token} userInfo={userInfo}></TodoContainer>;
    }
  }
  return (
    <Box>
      <NavBar
        token={token}
        projects={projects}
        curProject={curProject}
        setCurProject={setCurProject}
        setCurPage={setCurPage}
        logOut={logout}
      ></NavBar>
      <PageSelector />
      <Alarm token={token} />
      <DMContainer rooms={rooms} setRooms={setRooms} />
    </Box>
  );
}

const MakeProjectButton = (props) => {
  const { onSubmit } = props;

  const [portal, setPortal] = usePortal();
  useEffect(() => {
    setPortal(null);
  }, []);
  return (
    <Stack
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
      }}
    >
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        onSubmit={onSubmit}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography>프로젝트를 만들어주세요</Typography>
        </Box>
        <TextField
          required
          id="projectname"
          label="projectname"
          name="projectname"
          autoComplete="off"
          size="small"
        />
        <Button type="submit" variant="contained">
          생성!
        </Button>
      </Box>
    </Stack>
  );
};
