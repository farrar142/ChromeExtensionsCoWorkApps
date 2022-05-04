import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import Router from "next/router";
import { Link as ALink } from "../../src/Link";
import {
  useWarnMsg,
  useToken,
  useAccountsInfo,
  useSysMsg,
} from "../../src/hooks";
import { AUTH } from "../../src/API/todo";
import { useWebSocketHandler } from "../../src/websockets";
import {
  useExt,
  useKakao,
  useWebSocketMessage,
  useBrowserId,
} from "../../src/Atom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://soundcloud.com/sandring-443999826">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
export default function SignIn(props) {
  const { page, setPage } = props;
  const [token, setToken] = useToken();
  const [accountInfo, setAccountInfo] = useAccountsInfo();
  const [warnmsg, setWarnMsg] = useWarnMsg();
  const [sysmsg, setSysMsg] = useSysMsg();
  const [kakaoLink, setKakaoLink] = useKakao();
  const [ext, setExt] = useExt();
  //Login
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = await AUTH.login(data.get("email"), data.get("password"));
    if (result) {
      setToken(result);
      const _result = await AUTH.get_info(result);
      if (_result) {
        setSysMsg("로그인되었습니다."); // 커스텀 훅 안됨...
        setAccountInfo(_result);
      }
    } else {
      setWarnMsg("정보가 옳바르지 않아요");
    }
  };
  const browser_id = useBrowserId();
  function kakaoLogin(e) {
    e.preventDefault();
    axios
      .get(
        `https://todobackend.honeycombpizza.link/kakao/kakao_login?browser_id=${browser_id}`
      )
      .then((res) => {
        const url = res.data.url;
        // setKakaoLink(url);
        try {
          if (ext) {
            chrome.runtime.openOptionsPage();
            setSysMsg("다시 로그인 버튼을 눌러주세요!");
            setExt(false);
          } else {
            chrome.tabs.create({ url: url });
            setExt(true);
          }
        } catch {
          window.open(url);
        }
        // window.location.href = url;
      });
  }

  const [ws, setWs] = useState("not Opened");
  async function onMessageHandler(e) {
    const result = JSON.parse(JSON.parse(e.data).token)[0];
    setToken(result);
    const _result = await AUTH.get_info(result);
    if (_result) {
      setSysMsg("로그인되었습니다."); // 커스텀 훅 안됨...
      setAccountInfo(_result);
    }
  }
  useWebSocketHandler(`ws/kakao/${browser_id}/`, setWs, onMessageHandler);
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            color="secondary"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            color="secondary"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="secondary" />}
            label="Remember me"
            color="secondary"
          />
          <Button
            color="secondary"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Button
            color="kakao"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={kakaoLogin}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon color="black" icon={faComment} />
              <Typography color="common.black">Login with Kakao</Typography>
              <Box />
            </Box>
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/accounts/Idfinder" color="black.main">
                <Typography color="black">Forgot password?</Typography>
              </Link>
            </Grid>
            <Grid item>
              <Button
                color="secondary"
                variant="string"
                onClick={() => {
                  setPage(1);
                }}
              >
                <Typography>Sign Up</Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
