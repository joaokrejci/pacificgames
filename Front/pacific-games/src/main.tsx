import "./index.css";

import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { PlayerProvider } from "./context/player-context.tsx";
import { SessionProvider } from "./context/session-context.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <PlayerProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </PlayerProvider>
    </BrowserRouter>
  </StrictMode>,
);
