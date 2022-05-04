import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme, { themeMain } from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { RecoilRoot } from "recoil";
import SysMsg from "../components/SysMsg";
import { createTheme } from "@mui/material/styles";
import { IconButton, Tooltip } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useDarkMode } from "../src/Atom";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <RecoilRoot>
        <Sizer>
          <Component {...pageProps} />
        </Sizer>
      </RecoilRoot>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

const Sizer = (props) => {
  const darkTheme = createTheme({
    ...themeMain,
    palette: {
      ...themeMain.palette,
      mode: "dark",
      primary: {
        main: "#444",
      },
      black: {
        main: "#fff",
      },
      white: {
        main: "#000",
      },
    },
    components: {
      ...themeMain.components,
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: "#222222",
          },
        },
      },
    },
  });
  const [isDark, setIsDark] = useDarkMode();
  const [myTheme, setMyTheme] = useState(isDark ? darkTheme : theme);
  useEffect(() => {
    if (isDark == false) {
      setMyTheme(darkTheme);
    } else {
      setMyTheme(theme);
    }
  }, [isDark]);
  const themeIsDark = () => {
    setIsDark(!isDark);
  };
  return (
    <ThemeProvider theme={myTheme}>
      <div style={{ position: "fixed", left: "30px" }}>
        <Tooltip title={isDark ? "어두운 화면" : "밝은 화면"}>
          <IconButton onClick={themeIsDark}>
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </div>

      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <SysMsg />
      {props.children}
    </ThemeProvider>
  );
};
