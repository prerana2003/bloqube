import PropTypes from "prop-types";
import { useMemo } from "react";

import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Palette from "./palette";
import Typography from "./typography";

import hero from "./fonts/Hero-Regular.ttf";
import CustomShadows from "./shadows";

export default function ThemeCustomization({ children }) {
  const theme = Palette();

  const themeTypography = Typography(`"HeroFont", sans-serif `);
  const themeCustomShadows = useMemo(() => CustomShadows(theme), [theme]);

  const themeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1536,
        },
      },
      direction: "ltr",
      palette: theme.palette,
      typography: themeTypography,
      components: {
        MuiCssBaseline: {
          "@global": {
            "@font-face": {
              fontFamily: "HeroFont",
              src: `
            local('HeroFont'),
            url(${hero}) format('truetype')
          `,
            },
          },
        },
        MuiFormHelperText: {
          styleOverrides: {
            root: {
              marginLeft: 0,
              '&.Mui-error': {
                color: theme.palette.error.dark,
              }
            },
          }
      }
      },
      customShadows: themeCustomShadows,
    }),
    [theme, themeTypography, themeCustomShadows]
  );

  const themes = createTheme(themeOptions);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

ThemeCustomization.propTypes = {
  children: PropTypes.node,
};
