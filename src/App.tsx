import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Router } from "./Routers";
import Store from "./Store/Store";
import Theme from "./Theme";

function App() {
  return (
    <Provider store={Store}>
      <ThemeProvider theme={Theme}>
        <RouterProvider router={Router} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
