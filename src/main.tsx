import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ShopProvider } from "./shop";
import "@fontsource/commissioner/cyrillic-400.css";
import "@fontsource/commissioner/cyrillic-500.css";
import "@fontsource/commissioner/cyrillic-600.css";
import "@fontsource/commissioner/cyrillic-700.css";
import "@fontsource/commissioner/latin-400.css";
import "@fontsource/commissioner/latin-500.css";
import "@fontsource/commissioner/latin-600.css";
import "@fontsource/commissioner/latin-700.css";
import "@fontsource/russo-one/cyrillic-400.css";
import "@fontsource/russo-one/latin-400.css";
import "./styles.css";
import "./screen.css";
import "./smart-shop.css";
import "./product-os.css";
import "./holiday-world.css";
import "./black-red.css";
import "./admin.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ShopProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ShopProvider>
  </StrictMode>,
);
