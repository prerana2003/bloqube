// material-ui
import { createTheme } from "@mui/material/styles";

const Palette = () => {
  const brandColour = [
    "#fff5e6",
    "#ffd7a3",
    "#ffc17a",
    "#ff9933",
    "#ff8d29",
    "#ff6d00",
    "#d95700",
    "#b34100",
    "#8c2f00",
    "#661f00",
  ];
  return createTheme({
    palette: {
      primary: {
        lighter: brandColour[0],
        100: brandColour[1],
        200: brandColour[2],
        light: brandColour[3],
        400: brandColour[4],
        main: brandColour[5],
        dark: brandColour[6],
        700: brandColour[7],
        darker: brandColour[8],
        900: brandColour[9],
      },
      common: {
        black: "#000",
        white: "#fff",
      },
      background: {
        // default: "#F5F2F3",
        grey: "#6C737A",
      },
    },
  });
};

export default Palette;
