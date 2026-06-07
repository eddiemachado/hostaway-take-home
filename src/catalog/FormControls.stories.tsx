import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchLg } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Avatar } from "@/components/base/avatar/avatar";

/** Untitled UI form atoms: Input, Checkbox, Avatar (real components). */
const meta: Meta = { title: "Atoms/Form controls" };
export default meta;
type Story = StoryObj;

const InputDemo = () => {
    const [value, setValue] = useState("");
    return (
        <div className="flex w-80 flex-col gap-4">
            <Input label="Guest name" placeholder="e.g. Ava Reyes" value={value} onChange={setValue} />
            <Input icon={SearchLg} placeholder="Search…" aria-label="Search" value={value} onChange={setValue} />
        </div>
    );
};

const CheckboxDemo = () => {
    const [checked, setChecked] = useState(true);
    return (
        <div className="flex flex-col gap-3">
            <Checkbox label="Unchecked" isSelected={false} />
            <Checkbox label="Checked (toggle me)" isSelected={checked} onChange={setChecked} />
            <Checkbox label="Indeterminate" isIndeterminate />
        </div>
    );
};

export const InputStory: Story = { name: "Input", render: () => <InputDemo /> };
export const CheckboxStory: Story = { name: "Checkbox", render: () => <CheckboxDemo /> };

export const AvatarStory: Story = {
    name: "Avatar",
    render: () => (
        <div className="flex items-center gap-3">
            <Avatar size="xs" alt="Ava Reyes" initials="AR" />
            <Avatar size="sm" alt="Liam Khan" initials="LK" />
            <Avatar size="md" alt="Noah Silva" initials="NS" />
            <Avatar size="lg" alt="Photo" src="https://i.pravatar.cc/120?img=5" />
        </div>
    ),
};
