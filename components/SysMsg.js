import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { systemMessageState, useSnackBarOpen } from "../src/Atom";
import theme from "../src/theme";

// function Alert(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

export default (props) => {
  const [message, setMessage] = useRecoilState(systemMessageState);
  const [open, setOpen] = useSnackBarOpen();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert severity={message.type} onClose={handleClose}>
        {message.message}
      </Alert>
    </Snackbar>
  );
};

const styles = {
  msgCon: {
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    bottom: "55px",
    backgroundColor: theme.palette.white.main,

    margin: "0 auto",
    left: 0,
    right: 0,
    transition: "0.25s",
  },
  msg: {
    fontSize: "1.5rem",
    width: "100%",
  },
  icon: {
    paddingTop: "7px",
    cursor: "pointer",
  },
};
