import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/tokens/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import App from "@/App";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="light">
            <App />
        </ThemeProvider>
    </StrictMode>,
);
