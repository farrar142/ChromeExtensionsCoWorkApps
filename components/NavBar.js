import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Collapse,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { memo, useRef, useState } from "react";
import { usePortal } from "../src/Atom";

const isProjectsEquals = (prev, next) => {
  return prev.curProject === next.curProject && prev.projects === next.projets;
};
export default memo((props) => {
  const {
    token,
    children,
    logOut,
    curProject,
    setCurProject,
    setCurPage,
    projects,
  } = props;
  const [comp, setComp] = usePortal();
  const [toggle, setToggle] = useState(false);
  return (
    <Box
      sx={{
        position: "fixed",
        display: "flex",
        flexDirection: "row",
        alignItems: "start",
        zIndex: "10",
      }}
      component="div"
      elevation={0}
    >
      <IconButton onMouseOver={() => setToggle(!toggle)}>
        <MenuIcon />
      </IconButton>
      <Drawer
        open={toggle}
        onClose={() => {
          setToggle(!toggle);
        }}
        // onMouseLeave={() => {
        //   setToggle(!toggle);
        // }}
        anchor="left"
      >
        <Stack
          spacing={0.5}
          onMouseLeave={() => {
            setToggle(!toggle);
          }}
          sx={{
            height: "100%",
          }}
        >
          <SelectTodo
            token={token}
            setCurProject={setCurProject}
            setCurPage={setCurPage}
            curProject={curProject}
            projects={projects}
          />

          <Button
            onClick={() => {
              setCurPage(0);
            }}
          >
            프로젝트 만들기
          </Button>

          {comp}
          <Button variant="contained" onClick={logOut}>
            로그아웃
          </Button>
          <Button variant="contained" onClick={() => setCurPage(2)}>
            정보수정
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
}, isProjectsEquals);
const SelectTodo = memo((props) => {
  const { curProject, setCurProject, setCurPage, projects, removeProjects } =
    props;
  const [open, setOpen] = useState(false);
  const [indicator, setIndicator] = useState({});
  function openHandler(e) {
    setOpen(!open);
  }
  return (
    <Accordion
      expanded={open}
      onMouseOver={() => setOpen(true)}
      // onMouseOut={() => setOpen(false)}
      disableGutters={true}
    >
      <AccordionSummary
        onClick={() => {
          if (indicator.project_id) {
            setCurProject(indicator);
            setCurPage(1);
          }
        }}
      >
        <Typography>
          {curProject.project_name ? curProject.project_name : "프로젝트없음"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ProjectItems
          {...props}
          setIndicator={setIndicator}
          openHandler={openHandler}
        />
      </AccordionDetails>
    </Accordion>
  );
}, isProjectsEquals);

const ProjectItems = memo((props) => {
  const {
    setCurProject,
    curProject,
    setCurPage,
    projects,
    token,
    openHandler,
    setIndicator,
  } = props;
  if (projects.length >= 1) {
    return (
      <Stack direction="column">
        {projects.map((val) => {
          return (
            <Box key={val.project_id + val.project_name}>
              <Button
                variant="text"
                onClick={() => {
                  setCurPage(1);
                  setCurProject(val);
                  setIndicator(val);
                  openHandler();
                }}
                sx={{ textAlign: "left" }}
              >
                {val.project_name}
              </Button>
            </Box>
          );
        })}
      </Stack>
    );
  } else {
    return <Typography>프로젝트가 없어요!</Typography>;
  }
}, isProjectsEquals);
const style = {
  buttonStyle: {
    width: "100px",
    mx: 1,
  },
};
