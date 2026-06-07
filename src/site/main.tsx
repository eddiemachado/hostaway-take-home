import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/tokens/globals.css";
import "./site.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { SlideDeck } from "./SlideDeck";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="light">
            <SlideDeck />
        </ThemeProvider>
    </StrictMode>,
);
