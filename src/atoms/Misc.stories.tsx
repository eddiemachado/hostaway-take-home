import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";
import { Divider } from "./Divider";
import { Link } from "./Link";
import { Tooltip } from "./Tooltip";
import { Button } from "./Button";

/** Grouped stories for the smaller atoms. */
const meta: Meta = { title: "Atoms/Misc" };
export default meta;
type Story = StoryObj;

export const SpinnerStory: Story = {
    name: "Spinner",
    render: () => (
        <div className="flex items-center gap-6 text-fg-brand-primary">
            <Spinner className="size-4" />
            <Spinner className="size-6" />
            <Spinner className="size-8" />
        </div>
    ),
};

export const DividerStory: Story = {
    name: "Divider",
    render: () => (
        <div className="flex flex-col gap-4">
            <Divider />
            <div className="flex h-12 items-center gap-4">
                <span className="text-sm text-secondary">Left</span>
                <Divider orientation="vertical" />
                <span className="text-sm text-secondary">Right</span>
            </div>
        </div>
    ),
};

export const LinkStory: Story = {
    name: "Link",
    render: () => (
        <p className="text-md text-tertiary">
            Need help? <Link href="#">View the documentation</Link>.
        </p>
    ),
};

export const TooltipStory: Story = {
    name: "Tooltip",
    render: () => (
        <Tooltip title="This appears on hover & focus">
            <Button variant="secondary">Hover me</Button>
        </Tooltip>
    ),
};
