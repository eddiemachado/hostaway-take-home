import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "../src/providers/theme-provider";
// Design system foundations — tokens (light + dark), typography, Tailwind.
import "../src/tokens/globals.css";

const preview: Preview = {
    parameters: {
        layout: "padded",
        controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
        a11y: { test: "todo" },
        options: {
            storySort: {
                order: ["Foundations", "Atoms", "Molecules", "Organisms", "Templates", "Pages"],
            },
        },
    },
    globalTypes: {
        theme: {
            description: "Light / dark theme",
            toolbar: {
                title: "Theme",
                icon: "contrast",
                items: [
                    { value: "light", title: "Light", icon: "sun" },
                    { value: "dark", title: "Dark", icon: "moon" },
                ],
                dynamicTitle: true,
            },
        },
    },
    initialGlobals: { theme: "light" },
    decorators: [
        (Story, context) => {
            const theme = (context.globals.theme as string) ?? "light";
            // Seed the provider from the toolbar value, then remount it (key) when the toggle
            // changes so useTheme() works *and* the toolbar drives the active theme.
            try {
                localStorage.setItem("ui-theme", theme);
            } catch {
                /* ignore */
            }
            return (
                <ThemeProvider key={theme} defaultTheme={theme as "light" | "dark"}>
                    <div className="bg-primary text-primary">
                        <Story />
                    </div>
                </ThemeProvider>
            );
        },
    ],
};

export default preview;
