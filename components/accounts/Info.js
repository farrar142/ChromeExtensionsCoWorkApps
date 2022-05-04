import { memo, useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Divider,
  Button,
  FormControl,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  useAccountsInfo,
  useSysMsg,
  useToken,
  useWarnMsg,
} from "../../src/hooks";
import theme from "../../src/theme";
import Router from "next/router";
import { AUTH, TODO } from "../../src/API/todo";
import { Collapse } from "@material-ui/core";
import { useDM, useEditProject } from "../../src/Atom";
import useUser from "../../src/hooks/useUser";
import Picker from "../Picker";
function isProjectsEquals(n, p) {
  return n.projects == p.projects;
}
export default memo((props) => {
  const {
    projects,
    removeProject,
    appendProject,
    renameProject,
    changeProjectRule,
    joinProject,
    leaveProject,
    banProject,
    modifyName,
    addFriend,
    removeFriend,
    requestDM,
    createTag,
    modifyTag,
    deleteTag,
  } = props;
  const [token, setToken] = useToken();
  const [infos, setInfo] = useAccountsInfo();
  const [warn, setWarn] = useWarnMsg();
  const m_styles = styles(theme);
  const datas = [
    { key: "유저이름", value: infos.username },
    {
      key: "이름수정",
      value: (
        <FormControl component="form" onSubmit={modifyName}>
          <Box sx={{ display: "flex" }}>
            <TextField
              size="small"
              label="이름수정"
              name="username"
              required
            ></TextField>
            <Button type="submit" variant="contained">
              확인
            </Button>
          </Box>
        </FormControl>
      ),
    },
    { key: "이메일", value: infos.email },
  ];

  const Divide = (target, index) => {
    if (target.length >= 2 && target.length - 1 != index) {
      return <Divider />;
    }
  };
  return (
    <Container sx={m_styles.mainContainer}>
      <Paper sx={m_styles.infoCon}>
        {datas.map((val) => {
          return (
            <Box key={val.key} sx={m_styles.infoItems}>
              <Box sx={{ width: "50%" }}>
                <Typography>{val.key}</Typography>
              </Box>
              {val.value}
            </Box>
          );
        })}
      </Paper>
      <Paper sx={m_styles.infoCon}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 0.5,
          }}
        >
          <Typography component="h3">동무</Typography>
        </Box>
        <FormControl
          component="form"
          onSubmit={addFriend}
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <TextField
            required
            size="small"
            name="username"
            id="friend-name"
            label="동무 추가"
            multiline
            placeholder="동무의 이름을 입력해주세요"
            sx={{ width: "100%" }}
          />
          <Button type="submit" variant="contained">
            추가
          </Button>
        </FormControl>
        {infos.friends
          .filter((res) => res.id)
          .map((res, idx) => {
            return (
              <Box key={res + idx} sx={{ display: "flex" }}>
                <Typography sx={{ width: "50%" }}>{res.username}</Typography>
                <Box sx={{ display: "flex", width: "50%" }}>
                  <Button
                    variant="outlined"
                    sx={{ width: "50%" }}
                    onClick={() => requestDM(res)}
                    color="primary"
                  >
                    메세지
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ width: "50%" }}
                    onClick={() => removeFriend(res.id)}
                  >
                    친구삭제
                  </Button>
                </Box>
              </Box>
            );
          })}
      </Paper>
      <Paper sx={{ ...m_styles.infoCon }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 0.5,
          }}
        >
          <Typography component="h3">프로젝트</Typography>
        </Box>
        <FormControl
          component="form"
          onSubmit={joinProject}
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <TextField
            required
            size="small"
            name="code"
            id="code"
            label="프로젝트 참가"
            multiline
            placeholder="코드를 입력해주세요"
            sx={{ width: "100%" }}
          />
          <Button sx={{ width: "20%" }} type="submit" variant="contained">
            참가
          </Button>
        </FormControl>
        {projects.map((val, idx) => {
          const [edit, setEdit] = useEditProject(val.project_id);
          const [color, setColor] = useState("#00000000");
          const [tagName, setTagName] = useState("");
          const [pickerPortal, setPickerPortal] = useState(null);
          const isAuthor =
            val.participant.filter((res) => {
              return res.id == token.user_id && res.level == "ADMIN";
            }).length >= 1;
          useEffect(() => {
            setPickerPortal(<Picker colorSetter={setColor} />);
          }, []);
          function editHandler(e) {
            e.preventDefault();
            setEdit(!edit);
          }
          function renameHandler(e) {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            renameProject(token, val, data.get("projectname"));
          }
          function _createTag(e) {
            e.preventDefault();
            createTag(val, color, tagName);
            setTagName("");
          }
          function editTag(tag_id, name) {
            modifyTag(tag_id, color, name);
            setTagName("");
          }
          function LeaveButton() {
            if (!isAuthor) {
              return (
                <Box>
                  <Divider />
                  <Box sx={{ display: "flex" }}>
                    <Box sx={{ width: "100%" }} />
                    <Button
                      onClick={() => leaveProject(val)}
                      sx={{ width: "20%" }}
                    >
                      나가기
                    </Button>
                  </Box>
                </Box>
              );
            }
          }
          return (
            <Paper
              key={val.project_id}
              sx={{ my: 0.5, px: 0.5, ...m_styles.paperBack }}
            >
              <Box sx={m_styles.infoItems} onClick={editHandler}>
                <Box sx={{ width: "50%" }}>
                  <Typography>프로젝트 이름</Typography>
                </Box>
                <Typography>{val.project_name}</Typography>
              </Box>
              <Collapse in={isAuthor && !edit}>
                <FormControl
                  component="form"
                  sx={{ display: "flex", flexDirection: "column" }}
                  onSubmit={renameHandler}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <TextField
                      name="projectname"
                      label="프로젝트 이름"
                      defaultValue={val.project_name}
                      size="small"
                      sx={{ width: "100%" }}
                    />
                    <Button type="submit" variant="contained">
                      수정
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (confirm("정말 삭제하시겠어요?")) {
                          removeProject(token, val);
                        }
                      }}
                    >
                      삭제
                    </Button>
                  </Box>
                </FormControl>
                <Box>
                  <Typography>태그 설정하기</Typography>
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Box sx={{ width: "50%" }}>
                      {val.tags.map((res, idx) => {
                        return (
                          <Box
                            key={idx}
                            sx={{ display: "flex", flexDireciton: "row" }}
                          >
                            <Box
                              sx={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: res.code,
                              }}
                            />
                            <Box sx={{ width: "100%" }}>
                              <Typography>{res.name}</Typography>
                            </Box>
                            <Button
                              onClick={() =>
                                editTag(res.id, tagName ? tagName : res.name)
                              }
                              size="small"
                            >
                              수정
                            </Button>
                            <Button
                              onClick={() => deleteTag(val.project_id, res.id)}
                              size="small"
                            >
                              삭제
                            </Button>
                          </Box>
                        );
                      })}
                    </Box>
                    <Box sx={{ width: "50%" }}>
                      {pickerPortal}

                      <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Box
                          sx={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: color,
                          }}
                        />
                        <FormControl
                          component="form"
                          sx={{ display: "flex", flexDirection: "row" }}
                          onSubmit={_createTag}
                        >
                          <TextField
                            size="small"
                            value={tagName}
                            onChange={(e) => {
                              if (e.target.value.length >= 10) {
                                setWarn("10자 이상 넘어 갈 수 없어요.");
                                e.target.focus();
                              } else {
                                setTagName(e.target.value);
                              }
                            }}
                          />
                          <Button type="submit">추가</Button>
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Collapse>
              <Divider />
              <Box sx={m_styles.infoItems}>
                <Box sx={{ width: "50%" }}>
                  <Typography>참가코드</Typography>
                </Box>
                <Box>{val.project_code}</Box>
              </Box>
              <Divider />
              <Box sx={m_styles.infoItems}>
                <Box sx={{ width: "50%" }}>
                  <Typography>참가자</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
                  }}
                >
                  {val.participant
                    .map((res) => res)
                    .sort((a, b) => {
                      return rule(a.level) - rule(b.level);
                    })
                    .map((res, _idx) => {
                      const author = isAuthor && res.level != "ADMIN";
                      const [anchor, setAnchor] = useState(null);
                      const onClickHandler = (e) => {
                        author ? setAnchor(e.currentTarget) : null;
                      };
                      const onCloseHandler = () => {
                        setAnchor(null);
                      };
                      const open = Boolean(anchor);
                      const targetRule = res.level == "USER" ? "STAFF" : "USER";
                      let _res = (
                        <Box
                          key={res.id}
                          sx={{
                            width: "100%",
                            pr: 1,
                          }}
                        >
                          <Tooltip
                            title={author ? "권한변경" : ""}
                            placement="bottom-end"
                          >
                            <Typography
                              textAlign="right"
                              onClick={onClickHandler}
                              color={token.user_id == res.id ? "secondary" : ""}
                            >
                              {res.username}({res.level})
                            </Typography>
                          </Tooltip>
                          <Menu
                            anchorEl={anchor}
                            open={open}
                            onClose={onCloseHandler}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                          >
                            <MenuItem
                              onClick={() =>
                                changeProjectRule(
                                  val.project_id,
                                  res.id,
                                  targetRule
                                )
                              }
                            >
                              {targetRule}로 변경
                            </MenuItem>
                            <MenuItem onClick={() => banProject(val, res)}>
                              내보내기
                            </MenuItem>
                          </Menu>
                          {Divide(val.participant, _idx)}
                        </Box>
                      );
                      return _res;
                    })}
                </Box>
              </Box>
              {LeaveButton()}
            </Paper>
          );
        })}
      </Paper>
    </Container>
  );
}, isProjectsEquals);
function rule(aka) {
  if (aka == "ADMIN") {
    return 1;
  } else if (aka == "STAFF") {
    return 2;
  } else if (aka == "USER") {
    return 3;
  } else {
    return 5;
  }
}
const styles = (theme) => {
  return {
    mainContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    infoCon: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "20px",
      width: "500px",
      my: 0.5,
    },
    infoBox: {
      marginRight: "20px",
      marginLeft: "20p",
    },
    infoItems: {
      width: "100%",
      marginTop: "5px",
      marginBottom: "5px",
      marginRight: "5px",
      marginLeft: "5px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    paperBack: { background: theme.palette.paperBack.main },
  };
};

function objMap(obj) {
  let arr = [];
  for (let key in obj) {
    arr.push(obj[key]);
  }
  return arr;
}
