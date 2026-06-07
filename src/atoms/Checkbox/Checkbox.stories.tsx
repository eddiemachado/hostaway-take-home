import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
    title: "Atoms/Checkbox",
    component: Checkbox,
    args: { label: "Accept terms" },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

const Controlled = (args: React.ComponentProps<typeof Checkbox>) => {
    const [selected, setSelected] = useState(false);
    return <Checkbox {...args} isSelected={selected} onChange={setSelected} />;
};

export const Playground: Story = { render: (args) => <Controlled {...args} /> };

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
