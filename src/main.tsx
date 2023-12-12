import React from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container!);

const theme = createTheme({
  /** Put your mantine theme override here */
});

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
