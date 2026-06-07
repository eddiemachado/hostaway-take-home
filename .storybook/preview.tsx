import { useEffect, type ReactNode } from "react";
import type { Preview } from "@storybook/react-vite";
// Design system foundations — tokens (light + dark), typography, Tailwind.
import "../src/tokens/globals.css";

function ThemeWrapper({ theme, children }: { theme: string; children: ReactNode }) {
    useEffect(() => {
        document.documentElement.classList.toggle("dark-mode", theme === "dark");
    }, [theme]);
    return <div className="bg-primary text-primary">{children}</div>;
}

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
        (Story, context) => (
            <ThemeWrapper theme={context.globals.theme as string}>
                <Story />
            </ThemeWrapper>
        ),
    ],
};

export default preview;
