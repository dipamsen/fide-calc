import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
  Link,
} from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Tournament from "./Tournament.tsx";
import TournamentPlayer from "./TournamentPlayer.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/swiss/:tid",
    element: <Tournament />,
  },
  {
    path: "/swiss/:tid/player/:id",
    element: <TournamentPlayer />,
  },
]);

const theme = createTheme({ palette: { mode: "dark" } });

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <RouterProvider router={router} />
    {/* footer (created by dipamsen) */}
    <Box sx={{ marginTop: "20px", backgroundColor: "#242424", py: "10px" }}>
      <Typography variant="subtitle1" align="center">
        created by{" "}
        <Link href="https://github.com/dipamsen" target="_blank">
          dipamsen
        </Link>
      </Typography>
    </Box>
  </ThemeProvider>
  // </React.StrictMode>
);
