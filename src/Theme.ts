// theme.ts
import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        light: "#9cb9ff",
        main: "#465fff",
        dark: "#161950",
        contrastText: "#fff",
      },
    },
    typography: {
      fontFamily: ["Outfit", "sans-serif"].join(","),
    },
  });
//  mode === "light"
//           ? {
//               light: "#9cb9ff",
//               main: "#465fff",
//               dark: "#161950",
//               contrastText: "#fff",
//             }
//           : {
//               light: "#465fff",
//               main: "#9cb9ff",
//               dark: "#161950",
//               contrastText: "#fff",
//             },