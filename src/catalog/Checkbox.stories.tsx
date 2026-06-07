import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@/components/base/checkbox/checkbox";

/** Untitled UI Checkbox (real component). */
const meta: Meta<typeof Checkbox> = {
    title: "Atoms/Checkbox",
    component: Checkbox,
    tags: ["autodocs"],
    args: { label: "Accept terms", size: "sm", isSelected: false, isIndeterminate: false, isDisabled: false },
    argTypes: {
        label: { control: "text" },
        hint: { control: "text" },
        size: { control: "select", options: ["sm", "md"] },
        isSelected: { control: "boolean" },
        isIndeterminate: { control: "boolean" },
        isDisabled: { control: "boolean" },
    },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

/** Toggle checked / indeterminate / disabled from the Controls panel. */
export const Playground: Story = {};

export const States: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <Checkbox label="Unchecked" />
            <Checkbox label="Checked" isSelected />
            <Checkbox label="Indeterminate" isIndeterminate />
            <Checkbox label="Disabled" isDisabled />
        </div>
    ),
};
