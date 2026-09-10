import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth";
import { SiteProvider } from "./site";
import { routerBasename } from "./base";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename()}>
      <AuthProvider>
        <SiteProvider>
          <App />
        </SiteProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
