import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { Router } from "./Routers";
import { useAppSelector } from "./Store/hooks";
import { getTheme } from "./Theme";

function App() {
  const { isToggleTheme } = useAppSelector((state) => state.layout);
  return (
    <ThemeProvider theme={getTheme(isToggleTheme === "light" ? "light" : "dark")}>
      <RouterProvider router={Router} />
    </ThemeProvider>
  );
}

export default App;
