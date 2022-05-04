import { withStyles } from "@material-ui/styles";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  FormControl,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
function zero(str) {
  if (str.length == 1) {
    return "0" + str;
  } else {
    return str;
  }
}
export default (props) => {
  const { colorSetter, setter } = props;
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);
  const [opacity, setOpacity] = useState(255);
  const redHandler = (e) => {
    setRed(e.target.value);
  };
  const greenHandler = (e) => {
    setGreen(e.target.value);
  };
  const blueHandler = (e) => {
    setBlue(e.target.value);
  };
  const opacityHandler = (e) => {
    setOpacity(e.target.value);
  };
  const redToHex = zero(red.toString(16));
  const greenToHex = zero(green.toString(16));
  const blueToHex = zero(blue.toString(16));
  const opaToHex = zero(opacity.toString(16));
  function hexCode() {
    const color = "#" + redToHex + greenToHex + blueToHex + opaToHex;
    if (colorSetter) {
      colorSetter(color);
    }
    return color;
  }
  hexCode();
  return (
    <Box>
      Red
      <RedCustomSlider
        value={red}
        min={0}
        max={255}
        onChange={redHandler}
        aria-label="Default"
        valueLabelDisplay="auto"
        colors={{
          green: greenToHex,
          blue: blueToHex,
          opa: opaToHex,
        }}
      />
      Green
      <GreenCustomSlider
        value={green}
        min={0}
        max={255}
        onChange={greenHandler}
        aria-label="Default"
        valueLabelDisplay="auto"
        colors={{
          red: redToHex,
          blue: blueToHex,
          opa: opaToHex,
        }}
      />
      Blue
      <BlueCustomSlider
        value={blue}
        min={0}
        max={255}
        onChange={blueHandler}
        aria-label="Default"
        valueLabelDisplay="auto"
        colors={{
          red: redToHex,
          green: greenToHex,
          opa: opaToHex,
        }}
      />
      Opacity
      <OpaCustomSlider
        value={opacity}
        min={0}
        max={255}
        onChange={opacityHandler}
        aria-label="Default"
        valueLabelDisplay="auto"
        colors={{
          red: redToHex,
          green: greenToHex,
          blue: blueToHex,
        }}
      />
    </Box>
  );
};
//color: "linear-gradient(#000,#fff)",
const RedCustomSlider = styled(Slider)(({ colors }) => ({
  background: `linear-gradient(90deg,#00${colors.green}${colors.blue}${colors.opa},#ff${colors.green}${colors.blue}${colors.opa})`,
}));

const GreenCustomSlider = styled(Slider)(({ colors }) => ({
  background: `linear-gradient(90deg,#${colors.red}00${colors.blue}${colors.opa},#${colors.red}ff${colors.blue}${colors.opa})`,
}));

const BlueCustomSlider = styled(Slider)(({ colors }) => ({
  background: `linear-gradient(90deg,#${colors.red}${colors.green}00${colors.opa},#${colors.red}${colors.green}ff${colors.opa})`,
}));

const OpaCustomSlider = styled(Slider)(({ colors }) => ({
  background: `linear-gradient(90deg,#${colors.red}${colors.green}${colors.blue}00,#${colors.red}${colors.green}${colors.blue}ff)`,
}));
