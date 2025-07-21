import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00b3b3",
      contrastText: "#fff",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontfamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          backgroundImage: 'url("/assets/images/background.jpg")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#f0fbfb",
          backgroundAttachment: "fixed",
          height: "100vh",
          overflowY: "hidden",
        },
        "#root": {
          height: "100%",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Prevent uppercase text
          fontWeight: 500,
          "&:hover": {
            backgroundColor: "#009e9e",
          },
        },
      },
    },
  },
});

export default theme;
