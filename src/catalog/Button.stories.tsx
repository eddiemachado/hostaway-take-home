import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

/** Untitled UI Button (real component). API uses `color` + `size`. */
const meta: Meta<typeof Button> = {
    title: "Atoms/Button",
    component: Button,
    tags: ["autodocs"],
    args: { children: "Button", color: "primary", size: "md", isLoading: false, isDisabled: false },
    argTypes: {
        children: { control: "text", description: "Button label" },
        color: {
            control: "select",
            options: ["primary", "secondary", "tertiary", "primary-destructive", "secondary-destructive", "tertiary-destructive", "link-color", "link-gray"],
        },
        size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
        isLoading: { control: "boolean" },
        isDisabled: { control: "boolean" },
        showTextWhileLoading: { control: "boolean" },
        // Non-control props (functions / icon components).
        iconLeading: { control: false },
        iconTrailing: { control: false },
        onPress: { control: false, table: { disable: true } },
    },
};
export default meta;
type Story = StoryObj<typeof Button>;

/** Tweak every prop live from the Controls panel. */
export const Playground: Story = {};

export const Colors: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-3">
            <Button color="primary">Primary</Button>
            <Button color="secondary">Secondary</Button>
            <Button color="tertiary">Tertiary</Button>
            <Button color="primary-destructive">Destructive</Button>
            <Button color="link-color">Link</Button>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-3">
            {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
                <Button key={s} size={s}>
                    {s.toUpperCase()}
                </Button>
            ))}
        </div>
    ),
};

export const WithIcon: Story = { args: { iconLeading: Plus, children: "New reservation" } };
export const Loading: Story = { args: { isLoading: true, children: "Saving…" } };
