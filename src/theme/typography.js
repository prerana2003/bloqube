const Typography = (fontFamily) => ({
  htmlFontSize: 16,
  fontFamily,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  h1: {
    fontWeight: 300,
    fontSize: "6rem",
    lineHeight: 1.167,
  },
  h2: {
    fontWeight: 300,
    fontSize: "3.75rem",
    lineHeight: 1.27,
  },
  h3: {
    fontWeight: 400,
    fontSize: "3rem",
    lineHeight: 1.33,
  },
  h4: {
    fontWeight: 400,
    fontSize: "2.125rem",
    lineHeight: 1.235,
  },
  h5: {
    fontWeight: 400,
    fontSize: "1.5rem",
    lineHeight: 1.5,
  },
  h6: {
    fontWeight: 500,
    fontSize: "1.25rem",
    lineHeight: 1.6,
  },
  caption: {
    fontWeight: 400,
    fontSize: "0.75rem",
    lineHeight: 1.66,
  },
  body1: {
    fontSize: "1rem",
    lineHeight: 1.57,
  },
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.66,
  },
  subtitle1: {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.57,
  },
  subtitle2: {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.57,
  },
  overline: {
    lineHeight: 1.66,
  },
  button: {
    fontSize: "0.875rem",
    textTransform: "capitalize",
  },
});

export default Typography;
