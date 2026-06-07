import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "@untitledui/icons";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
    title: "Atoms/Button",
    component: Button,
    args: { children: "Button", variant: "primary", size: "md" },
    argTypes: {
        variant: { control: "select", options: ["primary", "secondary", "tertiary", "destructive"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        isLoading: { control: "boolean" },
        isDisabled: { control: "boolean" },
    },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

export const Variants: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="destructive">Destructive</Button>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
        </div>
    ),
};

export const WithIcon: Story = { args: { iconLeading: Plus, children: "New reservation" } };

export const Loading: Story = { args: { isLoading: true, children: "Saving…" } };

export const Disabled: Story = { args: { isDisabled: true, children: "Disabled" } };
