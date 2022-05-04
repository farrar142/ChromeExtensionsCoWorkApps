import { createTheme } from "@mui/material/styles";
// import { createTheme } from "@material-ui/core";
import { red } from "@mui/material/colors";
export const themeMain = {
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    paperBack: {
      main: "#cacaca50",
    },
    kakao: {
      main: "#fee500",
    },
    error: {
      main: red.A400,
    },
    effect: {
      main: "#eeeeee",
    },
    black: {
      main: "#000",
    },
    white: {
      main: "#fff",
    },
  },
  components: {
    // Name of the component
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
        },
      },
    },
  },
};
// Create a theme instance.
const theme = createTheme(themeMain);

export default theme;
