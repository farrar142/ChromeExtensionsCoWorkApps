import * as React from "react";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Box,
  Typography,
  Container,
  Button,
  Avatar,
  TextField,
} from "@mui/material";
import { AUTH } from "../../src/API/todo";
import { useWarnMsg } from "../../src/hooks";

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

export default function SignUp(props) {
  const { page, setPage } = props;
  const [warn, setWarn] = useWarnMsg();
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");
  const [email, setEmail] = React.useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    const email = data.get("email");
    const password = data.get("password");
    const password2 = data.get("password2");

    if (!validEmailCheck(email)) {
      setWarn("이메일을 정확하게 입력해주세요");
      return;
    }
    if (password !== password2) {
      setWarn("패스워드가 일치하지 않습니다.");
      return;
    }
    if (password.length < 8) {
      setWarn("비밀번호는 8자이상으로 입력해주세요");
      return;
    }
    AUTH.signup(username, email, password).then((value) => {
      if (value) {
        setPage(0);
      } else {
        setWarn("이미 가입된 이메일입니다.");
      }
    });
  };
  function validEmailCheck(value) {
    var pattern =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    return value.match(pattern) != null;
  }
  const emailValidation = () => {
    if (email == "") {
      return false;
    }
    if (!validEmailCheck(email)) {
      return "이메일을 정확하게 입력해주세요";
    }
    return false;
  };
  const passwordValidation = () => {
    if (password2 == "") {
      return false;
    }
    if (password !== password2) {
      return "패스워드가 일치하지 않습니다";
    }
    if (password.length < 8) {
      return "비밀번호는 8자 이상 이여야 됩니다.";
    } else {
      return false;
    }
  };
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
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            color="secondary"
          />
          <TextField
            error={emailValidation() ? true : false}
            margin="normal"
            required
            fullWidth
            name="email"
            label="Email"
            type="email"
            id="email"
            autoComplete="email"
            color="secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            helperText={emailValidation()}
          />
          <TextField
            error={passwordValidation() ? true : false}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            helperText={passwordValidation()}
            autoComplete="current-password"
            color="secondary"
          />
          <TextField
            error={passwordValidation() ? true : false}
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Password2"
            type="password"
            id="password2"
            helperText={passwordValidation()}
            value={password2}
            onChange={(e) => {
              setPassword2(e.target.value);
            }}
            autoComplete="current-password"
            color="secondary"
          />
          <Button
            color="secondary"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 1 }}
          >
            Sign Up
          </Button>
          <Button
            color="secondary"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            onClick={() => setPage(0)}
          >
            Back to Login Page
          </Button>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
